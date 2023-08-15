const cron = require("node-cron");
const timelineService = require("../services/TimelineService");

// Agenda a tarefa para ser executada a cada 30 minutos
cron.schedule("*/30 * * * *", async () => {
  console.log("Updating relevance scores...");
  await timelineService.updateRelevanceScores();
});