const timelineRepository = require("../repositories/TimelineRepository.js");

class TimelineService {
  async createPost(content, user) {
    const topPosts = await timelineRepository.getTopPostsByLocation(
      user.current_location
    );

    let averageRelevance = 10; // valor padrão
    if (topPosts.length > 0) {
      averageRelevance =
        topPosts.reduce((sum, post) => sum + post.relevance_score, 0) /
        topPosts.length;
    }
    averageRelevance = Math.round(averageRelevance);

    const post = {
      user_id: user.id,
      post_content: content,
      likes: 0,
      dislikes: 0,
      relevance_score: averageRelevance,
      location: user.current_location,
    };

    const [postId] = await timelineRepository.createPost(post);
    return postId;
  }

  async getPostsByUserLocation(userLocation, page, size) {
    return await timelineRepository.getPostsByLocationAndPagination(
      userLocation,
      page,
      size
    );
  }

  async handleReaction(postId, type, userId) {
    const existingReaction = await timelineRepository.getReaction(
      postId,
      userId
    );
    let action;

    if (!existingReaction) {
      action = "add";
    } else if (existingReaction.type === type) {
      action = "remove";
    } else {
      action = "update";
    }

    switch (action) {
      case "add":
        await timelineRepository.addReaction(postId, type, userId);
        await timelineRepository.adjustPostScores(postId, type, 1);
        break;

      case "remove":
        await timelineRepository.removeReaction(postId, userId);
        await timelineRepository.adjustPostScores(postId, type, -1);
        break;

      case "update":
        await timelineRepository.updateReaction(postId, type, userId);
        await timelineRepository.adjustPostScores(postId, type, 1);
        await timelineRepository.adjustPostScores(
          postId,
          existingReaction.type,
          -1
        );
        break;
    }

    return action;
  }

  async updateRelevanceScores(){
    return await timelineRepository.updateRelevanceScores();
  }

}

module.exports = new TimelineService();
