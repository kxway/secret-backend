exports.seed = async function(knex) {
  await knex('timeline').del();

  let samplePosts = [];

  samplePosts.push({
    user_id: 1,
    post_content: "Meu primeiro post aqui :D",
    likes: 0,
    dislikes: 0,
    location: "Queimados",
    relevance_score: 10,
    created_at: new Date("2023-08-11 08:27:13"),
    updated_at: new Date("2023-08-11 08:27:13")
  });

  // Generate 10 sample posts
  for(let i = 2; i <= 11; i++) {
    const randomLikes = Math.floor(Math.random() * 21);  // Random number between 0 and 20
    const randomDislikes = Math.floor(Math.random() * 11);  // Random number between 0 and 10
    const relevance = randomLikes + randomDislikes;  // Calculate relevance

    samplePosts.push({
      user_id: i,
      post_content: `Post do usuário ${i}`,
      likes: randomLikes,
      dislikes: randomDislikes,
      location: "Queimados",
      relevance_score: 10 + relevance,
      created_at: new Date(),
      updated_at: new Date()
    });
  }

  // Inserts seed entries
  return knex('timeline').insert(samplePosts);
};