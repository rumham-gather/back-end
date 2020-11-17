const client = require('../lib/client');
// import our seed data:
const recipes = require('./recipes.js');
const events = require('./events.js');
const usersData = require('./users.js');
const userEvents = require('./user-events.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (display_name, email, hash)
                      VALUES ($1, $2, $3)
                      RETURNING *;
                  `,
        [user.displayName, user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      recipes.map(recipe => {
        return client.query(`
                    INSERT INTO recipes (title, food_api_id, image_url, note, completed, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
        [recipe.title, recipe.food_api_id, recipe.image_url, recipe.note, recipe.completed, user.id]);
      })
    );
    

    await Promise.all(
      events.map(event => {
        return client.query(`
                    INSERT INTO events (title, date, owner_id)
                    VALUES ($1, $2, $3);
                `,
        [event.title, event.date, user.id]);
      })
    );

    await Promise.all(
      userEvents.map(userEvent => {
        return client.query(`
                    INSERT INTO user_events (user_id, event_id)
                    VALUES ($1, $2);
                `,
        [user.id, userEvent.event_id]);
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
