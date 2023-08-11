const cron = require("node-cron");
const TimelineService = require("./services/TimelineService");

const timelineService = new TimelineService();

// Agenda a tarefa para ser executada a cada 10 minutos
cron.schedule("*/10 * * * *", async () => {
  console.log("Updating relevance scores...");
  await timelineService.updateRelevanceScores();
});