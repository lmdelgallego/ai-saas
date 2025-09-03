import { Article, fetchArticles } from "@/lib/news";
import {marked} from 'marked'

import { inngest } from "../client";
import { sendEmail } from "@/lib/email";
import { createClient } from "@/lib/client";
import { getFrequency } from "@/lib/frecuency";


export default inngest.createFunction(
  {
    id: "newsletter/scheduled",
    cancelOn: [
      {
        event: "newsletter.scheduled.deleted",
        if: "async.data.user_id == event.data.user_id"
      }
    ]
  },
  { event: "newsletter.scheduled" },
  async ({ event, step, runId }) => {

      const { email, frequency, categories, user_id } = event.data

      const isUserActive = await step.run("check-user-status", async () =>{
        const supabase = await createClient();
        const { data, error } = await supabase.from('user_preferences').select('is_active').eq('user_id', user_id).single();

        if (error) {
          return false;
        }

        return data?.is_active ?? false;
      });

      if(!isUserActive) {
        return {};
      }

      const allArticles = await step.run("fetch-news", async () => {
        return fetchArticles(categories);
      });

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

        const nextScheduledTime = getFrequency(frequency);

        await inngest.send({
          name: 'newsletter.scheduled',
          data: {
            email,
            frequency,
            categories,
            user_id
          },
          ts: nextScheduledTime.getTime(),
        })
      })

      return {
        email,
        frequency,
        categories,
        content: newsletterContent
      }

    }
);