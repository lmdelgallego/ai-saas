import { inngest } from "../client";


export default inngest.createFunction(
  { id: "newsletter/scheduled" },
  { event: "newsletter.scheduled" },
  async ({ event, step, runId }) => {
      // Placeholder for the function logic
      console.log("Scheduled Newsletter function triggered", event);

      const allArticules = await step.run("fetch-news", async () => {
        const categories = ["technology", "health", "science"];

        // return fetchArticles(categories);
      })
    },
    // { cron: "0 9 * * 1" }, // Every Monday at 9 AM
);