require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

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
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns all recipes', async() => {

      const expectation = [
        {
          id: 1,
          title: 'Mac n Cheese',
          food_api_id: 3,
          image_url: 'http://placekitten.com/200/300',
          note: 'test',
          completed: false,
          owner_id: 1
        },
        {
          id: 2,
          title: 'Jeff\'s serrano Potato Salad',
          food_api_id: 20,
          image_url: 'http://placekitten.com/200/300',
          note: 'spicy',
          completed: false,
          owner_id: 1
        },
        {
          id: 3,
          title: 'Pizza',
          food_api_id: 57,
          image_url: 'http://placekitten.com/200/300',
          note: '',
          completed: false,
          owner_id: 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/recipes')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    test('returns one recipe', async() => {

      const expectation = [
        {
          id: 1,
          title: 'Mac n Cheese',
          food_api_id: 3,
          image_url: 'http://placekitten.com/200/300',
          note: 'test',
          completed: false,
          owner_id: 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/recipes/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


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
        .put('/recipes/1')
        .send({
          title: 'Test test test',
          food_api_id: 3,
          image_url: 'http://placekitten.com/200/300',
          note: 'test',
          completed: false,
          owner_id: 1
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });



  });
});
