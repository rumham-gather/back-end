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
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
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


app.get('/recipes', async(req, res) => {
  try {
    const data = await client.query('SELECT * from recipes');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});







app.put('/api/recipe/:id', async(req, res) => {
  try {
    const recipeId = req.params.id;
    const notes = {

      recipeId: req.body.recipeId,
      note: req.body.notes
    };

    const data = await client.query(`
              UPDATE recipe SET
              WHERE owner_id = user_id
              AND recipe.id 
                
    `)






app.post('/events', async(req, res) => {
  try {
    const data = await client.query(`
    INSERT into recipes (title, date, members)
    VALUES ($1, $2, $3)
    RETURNING *;
    `, [req.body.title, req.body.date, req.body.members]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
