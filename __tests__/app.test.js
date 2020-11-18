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
          password: '1234',
          display_name: 'johnnyboy' 
        });
      
      token = signInData.body.token; // eslint-disable-line
      console.log(signInData);
      console.log(token);

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

        .get('/api/recipes/1')
        .set('Authorization', token)
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

    test('returns all events', async() => {

      const expectation = [
        {
          id: 1,
          title: 'Thanksgiving',
          date: '2020-11-26T08:00:00.000Z',
          owner_id: 2
        },
        {
          id: 2,
          title: 'Christmas',
          date: '2020-12-25T08:00:00.000Z',
          owner_id: 1
        },
        {
          id: 3,
          title: 'Valentines',
          date: '2021-02-14T08:00:00.000Z',
          owner_id: 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/events')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('returns one event by id', async() => {

      const expectation = [
        {
          id: 3,
          title: 'Valentines',
          date: '2021-02-14T08:00:00.000Z',
          owner_id: 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/events/3')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('updates a recipe', async() => {

      const expectation = 
      {
        id: 3,
        title: 'Anti-Valentines',
        date: '2021-02-14T08:00:00.000Z',
        owner_id: 1
      };

      const data = await fakeRequest(app)
        .put('/events/3')
        .send({
          id: 3,
          title: 'Anti-Valentines',
          date: '2021-02-14T08:00:00.000Z',
          owner_id: 1
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
