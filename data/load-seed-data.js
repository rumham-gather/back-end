const client = require('../lib/client');
// import our seed data:
const animals = require('./animals.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (username, email, hash)
                      VALUES ($1, $2, $3)
                      RETURNING *;
                  `,
        [user.username, user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      recipes.map(recipe => {
        return client.query(`
                    INSERT INTO recipes (title, food_api_ip, image_url, note, completed, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
        [recipe.title, recipe.food_api_ip, recipe.image_url, recipe.note, recipe.completed, user.id]);
      })
    );
    

    await Promise.all(
      events.map(event => {
        return client.query(`
                    INSERT INTO recipes (title, date, members, owner_id)
                    VALUES ($1, $2, $3, $4);
                `,
        [event.title, event.date, event.members, user.id]);
      })
    );

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
