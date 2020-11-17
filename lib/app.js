const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/sign in and a /auth/signup POST route. 
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


app.get('/recipes', async(req, res) => {
  try {
    const data = await client.query('SELECT * from recipes');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


app.get('/recipes/:id', async(req, res) => {
  try {
    const recipeId = req.params.id;
    const data = await client.query(`      
    SELECT 
    recipes.id, 
    recipes.title, 
    recipes.food_api_id, 
    recipes.image_url, 
    recipes.note,
    recipes.completed,
    recipes.owner_id
  FROM recipes
  WHERE recipes.id = $1
  `, [recipeId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


app.put('/api/recipes/:id', async(req, res) => {
  try {
   
    const recipesId = req.params.id;
    const data = await client.query(`
    UPDATE recipes SET 
      note = $1
      WHERE 
      owner_id = $2
      AND
      id = $3
      RETURNING *
    `, 
    
    [recipesId]);

    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/events', async(req, res) => {
  try {
    const data = await client.query('SELECT * from events');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

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

app.put('/events/:id', async(req, res) => {
  try {
   
    const newTitle = req.body.title;
    const newDate = req.body.date;
    const newMembers = req.body.members;
    const newOwnerId = req.body.owner_id;
    const data = await client.query(`
    UPDATE events SET 
      title = $1,
      date = $2,
      members = $3,
      owner_id = $4
      WHERE events.id = $5
      RETURNING *
    `, 
    
    [newTitle, newDate, newMembers, newOwnerId, req.params.id]);

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

app.use(require('./middleware/error'));

module.exports = app;
