require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const recipeData = require('../data/recipe.json');
const { mungedRecipe } = require('../utils.js');


describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234',
          display_name: 'johnnyboy' 
        });
      
      token = signInData.body.token; // eslint-disable-line

      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    // test('returns all recipes', async() => {

    //   const expectation = [
    //     {
    //       id: 1,
    //       title: 'Mac n Cheese',
    //       food_api_id: 3,
    //       image_url: 'http://placekitten.com/200/300',
    //       note: 'test',
    //       completed: false,
    //       owner_id: 1
    //     },
    //     {
    //       id: 2,
    //       title: 'Jeff\'s serrano Potato Salad',
    //       food_api_id: 20,
    //       image_url: 'http://placekitten.com/200/300',
    //       note: 'spicy',
    //       completed: false,
    //       owner_id: 1
    //     },
    //     {
    //       id: 3,
    //       title: 'Pizza',
    //       food_api_id: 57,
    //       image_url: 'http://placekitten.com/200/300',
    //       note: '',
    //       completed: false,
    //       owner_id: 1
    //     }
    //   ];

    //   const data = await fakeRequest(app)
    //     .get('/recipes')
    //     .expect('Content-Type', /json/)
    //     .expect(200);

    //   expect(data.body).toEqual(expectation);
    // });

    // test('returns one recipe', async() => {

    //   const expectation = [
    //     {
    //       id: 1,
    //       title: 'Mac n Cheese',
    //       food_api_id: 3,
    //       image_url: 'http://placekitten.com/200/300',
    //       note: 'test',
    //       completed: false,
    //       owner_id: 1
    //     }
    //   ];

    //   const data = await fakeRequest(app)

    //     .get('/api/recipes/1')
    //     .set('Authorization', token)
    //     .expect('Content-Type', /json/)
    //     .expect(200);

    //   expect(data.body).toEqual(expectation);
    // });

    test('updates a recipe', async() => {

      const expectation = 
      {
        id: 1,
        title: 'Mac n Cheese',
        food_api_id: 3,
        image_url: 'http://placekitten.com/200/300',
        note: 'test',
        completed: false,
        owner_id: 1
      };

      const data = await fakeRequest(app)
        .put('/api/recipes/1')
        .send({
          title: 'Test test test',
          food_api_id: 3,
          image_url: 'http://placekitten.com/200/300',
          note: 'test',
          completed: false,
          owner_id: 1
        })
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    // test('returns all events', async() => {

    //   const expectation = [
    //     {
    //       id: 1,
    //       title: 'Thanksgiving',
    //       date: '2020-11-26T08:00:00.000Z',
    //       owner_id: 2
    //     },
    //     {
    //       id: 2,
    //       title: 'Christmas',
    //       date: '2020-12-25T08:00:00.000Z',
    //       owner_id: 1
    //     },
    //     {
    //       id: 3,
    //       title: 'Valentines',
    //       date: '2021-02-14T08:00:00.000Z',
    //       owner_id: 1
    //     }
    //   ];

    //   const data = await fakeRequest(app)
    //     .get('/events')
    //     .expect('Content-Type', /json/)
    //     .expect(200);

    //   expect(data.body).toEqual(expectation);
    // });

    // test('returns one event by id', async() => {

    //   const expectation = [
    //     {
    //       id: 3,
    //       title: 'Valentines',
    //       date: '2021-02-14T08:00:00.000Z',
    //       owner_id: 1
    //     }
    //   ];

    //   const data = await fakeRequest(app)
    //     .get('/events/3')
    //     .expect('Content-Type', /json/)
    //     .expect(200);

    //   expect(data.body).toEqual(expectation);
    // });

    // test('updates a recipe', async() => {

    //   const expectation = 
    //   {
    //     id: 3,
    //     title: 'Anti-Valentines',
    //     date: '2021-02-14T08:00:00.000Z',
    //     owner_id: 1
    //   };

    //   const data = await fakeRequest(app)
    //     .put('/events/3')
    //     .send({
    //       id: 3,
    //       title: 'Anti-Valentines',
    //       date: '2021-02-14T08:00:00.000Z',
    //       owner_id: 1
    //     })
    //     .expect('Content-Type', /json/)
    //     .expect(200);

    //   expect(data.body).toEqual(expectation);
    // });

    test('tests munged recipe function', async() => {

      const expectation = 
        {
          title: 'Shrimp and Lemongrass Soup',
          food_api_id: 1558837,
          image_url: 'https://spoonacular.com/recipeImages/1558837-556x370.jpg',
          ingredients: [
            '6 raw jumbo shrimp, peeled and deviened, peels reserved',
            '2 lemongrass stems',
            '1 scallion, thinly sliced',
            '1 c. bean sprouts',
            '1 lime, juiced',
            '1 carrot, peeled and julienned',
            '1/2 daikon, peeled and julienned',
            '4 c. chicken stock',
            'Mint, for garnish',
          ],
          instructions: 'Cut off the white part of the lemongrass stems, reserving tops. Cut the white part into inch long pieces and flatten with the knife. Bring chicken stock to a boil in a large stockpot and add lemongrass stem and shrimp shells. Simmer for 2 minutes, then set aside to infuse.\nStrain stock, then return to stock pot. Slice the remaining lemongrass stem and finely chop. Add to stock along with shrimp, and simmer for 3-4 minutes until shrimp is pink. Add lime juice, scallions, bean sprouts, carrots and daikon.\nStir well and season well. Serve with a mint garnish.',
        };

      const results = mungedRecipe(recipeData);
      expect(results).toEqual(expectation);
    });
  });
});
