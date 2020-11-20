const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
const request = require('superagent');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this protected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/users', async(req, res) => {
  try {
    const data = await client.query('SELECT * from users');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

// tested PASSING!!!! 
app.get('/api/recipes', async(req, res) => {
  try {
    const data = await request.get(`https://api.spoonacular.com/recipes/random?number=25&apiKey=${process.env.API_KEY}`);
    
    res.json(data.body);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


app.get('/api/recipes/:id', async(req, res) => {
  try {

    const data = await request.get(`https://api.spoonacular.com/recipes/${req.params.id}/information?apiKey=${process.env.API_KEY}`);
    
    res.json(data.body);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/user-recipes', async(req, res) => {
  try {
    const data = await client.query(`
    INSERT into user_recipes (recipe_id, user_id)
    VALUES ($1, $2)
    RETURNING *;
    `, 
    
    [req.body.recipeId, req.userId]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/user-recipes', async(req, res) => {
  try {
    const data = await client.query(`
    SELECT 
      user_recipes.id,
      users.id as userId, 
      recipe_id, 
      users.display_name
    FROM user_recipes
    JOIN users ON user_id = users.id
    WHERE user_id = $1
    `, 
    [req.userId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/user-recipes/:id', async(req, res) => {
  try {
    const data = await client.query(`
    DELETE FROM user_recipes
    WHERE id = $1
    AND user_id = $2
    RETURNING *;
    `, 
    [req.params.id, req.userId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/recipes/:id', async(req, res) => {
  try {
   
    const data = await client.query(`
    UPDATE recipes 
      SET note = $1
      WHERE owner_id = $2
      AND id = $3
      RETURNING *
    `, 
    
    [req.body.note, req.body.owner_id, req.params.id]);

    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// tested and PASSING!!
app.get('/events', async(req, res) => {
  try {
    const data = await client.query('SELECT * from events');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

// tested and PASSING!!
app.get('/events/:id', async(req, res) => {
  try {
    const eventId = req.params.id;
    const data = await client.query(`
    SELECT * FROM events
    WHERE events.id = $1`
    , [eventId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

// tested and PASSING!!
app.put('/events/:id', async(req, res) => {
  try {
    
    const newTitle = req.body.title;
    const newDate = req.body.date;
    const newOwnerId = req.body.owner_id;
    const data = await client.query(`
    UPDATE events SET 
    title = $1,
    date = $2,
    owner_id = $3
    WHERE events.id = $4
    RETURNING *
    `, 
    
    [newTitle, newDate, newOwnerId, req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/events', async(req, res) => {
  try {
    const data = await client.query(`
    INSERT into recipes (title, date, owner_id)
    VALUES ($1, $2, $3)
    RETURNING *;
    `, 
    
    [req.body.title, req.body.date, req.userId]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


app.delete('/events/:id', async(req, res) => {
  try {
    const eventId = req.params.id;
    
    const data = await client.query(`
    DELETE from events 
    WHERE events.id = $1
    `,
    [eventId]);
    
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/user-events', async(req, res) => {
  try {
    const data = await client.query(`
    INSERT into user_events (event_id, user_id)
    VALUES ($1, $2)
    RETURNING *;
    `, 
    
    [req.body.eventId, req.userId]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/user-events/:id', async(req, res) => {
  try {
    const eventId = req.params.id;
    const data = await client.query(`
    SELECT 
      title, 
      date, 
      owner_id, 
      display_name, 
      email 
      FROM user_events
    JOIN events ON event_id = events.id
    JOIN users ON user_id = users.id
    WHERE event_id = $1
    `, 
    [eventId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.post('/event-recipes', async(req, res) => {
  try {
    const data = await client.query(`
    INSERT into event_recipes (recipe_id, event_id)
    VALUES ($1, $2)
    RETURNING *;
    `, 
    
    [req.body.recipeId, req.body.eventId]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/event-recipes/:id', async(req, res) => {
  try {
    const recipeId = req.params.id;
    const data = await client.query(`
    SELECT 
	  recipes.title,
	  image_url,
	  completed
    FROM event_recipes
    JOIN recipes ON recipe_id = recipes.id
    JOIN events ON event_id = events.id
	WHERE event_id = $1 
    `, 
    [recipeId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});



app.use(require('./middleware/error'));

module.exports = app;
