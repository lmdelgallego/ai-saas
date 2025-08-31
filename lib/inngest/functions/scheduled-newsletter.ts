import { Article, fetchArticles } from "@/lib/news";
import { inngest } from "../client";


export default inngest.createFunction(
  { id: "newsletter/scheduled" },
  { event: "newsletter.scheduled" },
  async ({ event, step, runId }) => {
      // Placeholder for the function logic
      console.log("Scheduled Newsletter function triggered", event);
      const categories = ["technology", "business", "science"];

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

      console.log("Summary generated", summary.choices[0].message.content);

      return {}

    }
);