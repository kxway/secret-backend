const db = require("../config/db.js");

class TimelineService {
  async updateRelevanceScores() {
    try {
      // Decrementa a pontuação de relevância apenas para posts com relevance_score maior que 1
      await db("timeline")
        .where("relevance_score", ">", 1)
        .decrement("relevance_score", 1);
    } catch (error) {
      console.error("Error updating relevance scores:", error);
    }
  }
}

module.exports = TimelineService;
