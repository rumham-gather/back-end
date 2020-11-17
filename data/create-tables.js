const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    display_name VARCHAR(256) NOT NULL,
                    email VARCHAR(256) NOT NULL,
                    hash VARCHAR(512) NOT NULL
                );           
          
                CREATE TABLE recipes (
                    id SERIAL PRIMARY KEY NOT NULL,
                    title VARCHAR(256) NOT NULL,
                    food_api_id INTEGER NOT NULL,
                    image_url VARCHAR(512) NOT NULL,
                    note VARCHAR(512),
                    completed BOOLEAN NOT NULL,
                    owner_id INTEGER NOT NULL REFERENCES users(id)
                );

                CREATE TABLE events (
                  id SERIAL PRIMARY KEY NOT NULL,
                  title VARCHAR(256) NOT NULL,
                  date DATE NOT NULL,
                  members VARCHAR(512), 
                  owner_id INTEGER NOT NULL REFERENCES users(id)
                );

                CREATE TABLE user_events (
                  user_id INTEGER NOT NULL REFERENCES users(id),
                  event_id INTEGER NOT NULL REFERENCES events(id)
                );

                CREATE TABLE user_recipes (
                  user_id INTEGER NOT NULL REFERENCES users(id),
                  recipe_id INTEGER NOT NULL REFERENCES recipes(id)
                );

                CREATE TABLE event_recipes (
                  event_id INTEGER NOT NULL REFERENCES events(id),
                  recipe_id INTEGER NOT NULL REFERENCES recipes(id)
                );
        `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
