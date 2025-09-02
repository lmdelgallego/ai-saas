import { Article, fetchArticles } from "@/lib/news";
import {marked} from 'marked'

import { inngest } from "../client";
import { sendEmail } from "@/lib/email";


export default inngest.createFunction(
  { id: "newsletter/scheduled" },
  { event: "newsletter.scheduled" },
  async ({ event, step, runId }) => {
      // Placeholder for the function logic
      const {email, frequency, categories} = event.data

      const allArticles = await step.run("fetch-news", async () => {
        return fetchArticles(categories);
      });

      //GENERATE AI SUMMARY

      const summary = await step.ai.infer("summarize-news", {
        model: step.ai.models.openai({model: 'gpt-4o'}),
        body: {
          messages: [
            {
              role: "system",
              content: `You are an expert newsletter editor creating a personalized newsletter.
                        Write a concise, engaging summary that:
                        - Highlights the most important stories
                        - Provides context and insights
                        - Uses a friendly, conversational tone
                        - Is well-structured with clear sections
                        - Keeps the reader informed and engaged
                        Format the response as a proper newsletter with a title and organized content.
                        Make it email-friendly with clear sections and engaging subject lines.`,
            },
            {
              role: "user",
              content: `Create a newsletter summary from these articles from the pass week.
              Categories requested: ${categories.join(', ')}

              Articles:
              ${allArticles.map((article: Article, idx: number) => `${idx + 1}. ${article.title}\n ${
              article.description}
              \n Source: ${article.url}\n`).join("\n")}
              `,
            },
          ]
        }
      });

      const newsletterContent = summary.choices[0].message.content

      if(!newsletterContent) {
        throw new Error('Failed to generate newsletter content')
      }

      const htmlResult = await marked.parse(newsletterContent)

      await step.run("send-email", async () => {
        await sendEmail(
          email,
          categories.join(', '),
          allArticles.length,
          htmlResult
        )
      });

      await step.run("schedule-next", async () => {
        const now = new Date();
        let nextScheduledTime: Date;

        switch (frequency) {
          case 'daily':
            // nextScheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
            nextScheduledTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            break;
          case 'weekly':
            // nextScheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 0, 0, 0);
            nextScheduledTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
          case 'bi-weekly':
            // nextScheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14, 0, 0, 0);
            nextScheduledTime = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
            break;
          default:
            nextScheduledTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            break;
        }

        nextScheduledTime.setHours(9, 0, 0, 0);

        await inngest.send({
          name: 'newsletter.scheduled',
          data: {
            email,
            frequency,
            categories
          },
          ts: nextScheduledTime.getTime(),
        })
      })

      return {}

    }
);