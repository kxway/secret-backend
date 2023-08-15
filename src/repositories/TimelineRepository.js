const db = require("../db/main.js");
const knexPaginate = require("knex-paginate");

knexPaginate.attachPaginate();

class TimelineRepository {
  async getTopPostsByLocation(location) {
    try {
      return await db("timeline")
        .where({ location })
        .orderBy("relevance_score", "desc")
        .limit(10);
    } catch (e) {
      console.log(e);
    }
  }

  async createPost(postData) {
    try {
      return await db("timeline").insert(postData).returning("id");
    } catch (e) {
      console.log(e);
    }
  }

  async getPostsByLocationAndPagination(location, page = 1, size = 20) {
    try {
      return await db("timeline")
        .where("location", location)
        .orderBy([
          { column: "relevance_score", order: "desc" },
          { column: "created_at", order: "desc" },
        ])
        .paginate({
          perPage: size,
          currentPage: page,
        });
    } catch (e) {
      console.log(e);
    }
  }

  async getReaction(postId, userId) {
    return await db("post_reactions")
      .where({
        post_id: postId,
        user_id: userId,
      })
      .first();
  }

  async addReaction(postId, type, userId) {
    await db("post_reactions").insert({
      post_id: postId,
      type: type,
      user_id: userId,
    });
  }

  async removeReaction(postId, userId) {
    await db("post_reactions")
      .where({ post_id: postId, user_id: userId })
      .del();
  }

  async updateReaction(postId, type, userId) {
    await db("post_reactions")
      .where({ post_id: postId, user_id: userId })
      .update({ type });
  }

  async adjustPostScores(postId, type, amount) {
    await db("timeline")
      .where({ id: postId })
      .increment(`${type}s`, amount)
      .increment("relevance_score", amount);
  }

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

module.exports = new TimelineRepository();
