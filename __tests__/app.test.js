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

    test('returns one recipe', async() => {

      const expectation = {
        'vegetarian': false,
        'vegan': false,
        'glutenFree': true,
        'dairyFree': true,
        'veryHealthy': false,
        'cheap': false,
        'veryPopular': false,
        'sustainable': false,
        'weightWatcherSmartPoints': 3,
        'gaps': 'no',
        'lowFodmap': false,
        'aggregateLikes': 13,
        'spoonacularScore': expect.any(Number),
        'healthScore': 22.0,
        'creditsText': 'Foodista.com – The Cooking Encyclopedia Everyone Can Edit',
        'license': 'CC BY 3.0',
        'sourceName': 'Foodista',
        'pricePerServing': 168.22,
        'extendedIngredients': [
          {
            'id': 15152,
            'aisle': 'Seafood',
            'image': 'shrimp.png',
            'consistency': 'solid',
            'name': 'raw shrimp',
            'original': '6 raw jumbo shrimp, peeled and deviened, peels reserved',
            'originalString': '6 raw jumbo shrimp, peeled and deviened, peels reserved',
            'originalName': 'raw jumbo shrimp, peeled and deviened, peels reserved',
            'amount': 6.0,
            'unit': 'jumbo',
            'meta': [
              'raw',
              'peeled'
            ],
            'metaInformation': [
              'raw',
              'peeled'
            ],
            'measures': {
              'us': {
                'amount': 6.0,
                'unitShort': 'jumbo',
                'unitLong': 'jumbos'
              },
              'metric': {
                'amount': 6.0,
                'unitShort': 'jumbo',
                'unitLong': 'jumbos'
              }
            }
          },
          {
            'id': 11972,
            'aisle': 'Produce;Ethnic Foods',
            'image': 'lemongrass.png',
            'consistency': 'solid',
            'name': 'lemongrass',
            'original': '2 lemongrass stems',
            'originalString': '2 lemongrass stems',
            'originalName': 'lemongrass stems',
            'amount': 2.0,
            'unit': '',
            'meta': [
              
            ],
            'metaInformation': [
              
            ],
            'measures': {
              'us': {
                'amount': 2.0,
                'unitShort': '',
                'unitLong': ''
              },
              'metric': {
                'amount': 2.0,
                'unitShort': '',
                'unitLong': ''
              }
            }
          },
          {
            'id': 11291,
            'aisle': 'Produce',
            'image': 'spring-onions.jpg',
            'consistency': 'solid',
            'name': 'scallion',
            'original': '1 scallion, thinly sliced',
            'originalString': '1 scallion, thinly sliced',
            'originalName': 'scallion, thinly sliced',
            'amount': 1.0,
            'unit': '',
            'meta': [
              'thinly sliced'
            ],
            'metaInformation': [
              'thinly sliced'
            ],
            'measures': {
              'us': {
                'amount': 1.0,
                'unitShort': '',
                'unitLong': ''
              },
              'metric': {
                'amount': 1.0,
                'unitShort': '',
                'unitLong': ''
              }
            }
          },
          {
            'id': 11043,
            'aisle': 'Produce;Ethnic Foods',
            'image': 'bean-sprouts.jpg',
            'consistency': 'solid',
            'name': 'bean sprouts',
            'original': '1 c. bean sprouts',
            'originalString': '1 c. bean sprouts',
            'originalName': 'bean sprouts',
            'amount': 1.0,
            'unit': 'c',
            'meta': [
              
            ],
            'metaInformation': [
              
            ],
            'measures': {
              'us': {
                'amount': 1.0,
                'unitShort': 'cup',
                'unitLong': 'cup'
              },
              'metric': {
                'amount': 236.588,
                'unitShort': 'ml',
                'unitLong': 'milliliters'
              }
            }
          },
          {
            'id': 9160,
            'aisle': 'Produce',
            'image': 'lime-juice.png',
            'consistency': 'liquid',
            'name': 'juice of lime',
            'original': '1 lime, juiced',
            'originalString': '1 lime, juiced',
            'originalName': 'lime, juiced',
            'amount': 1.0,
            'unit': '',
            'meta': [
              'juiced'
            ],
            'metaInformation': [
              'juiced'
            ],
            'measures': {
              'us': {
                'amount': 1.0,
                'unitShort': '',
                'unitLong': ''
              },
              'metric': {
                'amount': 1.0,
                'unitShort': '',
                'unitLong': ''
              }
            }
          },
          {
            'id': 11124,
            'aisle': 'Produce',
            'image': 'sliced-carrot.png',
            'consistency': 'solid',
            'name': 'carrot',
            'original': '1 carrot, peeled and julienned',
            'originalString': '1 carrot, peeled and julienned',
            'originalName': 'carrot, peeled and julienned',
            'amount': 1.0,
            'unit': '',
            'meta': [
              'julienned',
              'peeled'
            ],
            'metaInformation': [
              'julienned',
              'peeled'
            ],
            'measures': {
              'us': {
                'amount': 1.0,
                'unitShort': '',
                'unitLong': ''
              },
              'metric': {
                'amount': 1.0,
                'unitShort': '',
                'unitLong': ''
              }
            }
          },
          {
            'id': 11430,
            'aisle': 'Produce',
            'image': 'daikon.jpg',
            'consistency': 'solid',
            'name': 'daikon',
            'original': '1/2 daikon, peeled and julienned',
            'originalString': '1/2 daikon, peeled and julienned',
            'originalName': 'daikon, peeled and julienned',
            'amount': 0.5,
            'unit': '',
            'meta': [
              'julienned',
              'peeled'
            ],
            'metaInformation': [
              'julienned',
              'peeled'
            ],
            'measures': {
              'us': {
                'amount': 0.5,
                'unitShort': '',
                'unitLong': ''
              },
              'metric': {
                'amount': 0.5,
                'unitShort': '',
                'unitLong': ''
              }
            }
          },
          {
            'id': 6172,
            'aisle': 'Canned and Jarred',
            'image': 'chicken-broth.png',
            'consistency': 'liquid',
            'name': 'chicken stock',
            'original': '4 c. chicken stock',
            'originalString': '4 c. chicken stock',
            'originalName': 'chicken stock',
            'amount': 4.0,
            'unit': 'c',
            'meta': [
              
            ],
            'metaInformation': [
              
            ],
            'measures': {
              'us': {
                'amount': 4.0,
                'unitShort': 'cups',
                'unitLong': 'cups'
              },
              'metric': {
                'amount': 946.352,
                'unitShort': 'ml',
                'unitLong': 'milliliters'
              }
            }
          },
          {
            'id': 2064,
            'aisle': 'Produce',
            'image': 'mint.jpg',
            'consistency': 'solid',
            'name': 'mint',
            'original': 'Mint, for garnish',
            'originalString': 'Mint, for garnish',
            'originalName': 'Mint, for garnish',
            'amount': 1.0,
            'unit': 'serving',
            'meta': [
              'for garnish'
            ],
            'metaInformation': [
              'for garnish'
            ],
            'measures': {
              'us': {
                'amount': 1.0,
                'unitShort': 'serving',
                'unitLong': 'serving'
              },
              'metric': {
                'amount': 1.0,
                'unitShort': 'serving',
                'unitLong': 'serving'
              }
            }
          }
        ],
        'id': 1558837,
        'title': 'Shrimp and Lemongrass Soup',
        'author': 'renay1230',
        'readyInMinutes': 45,
        'servings': 4,
        'sourceUrl': 'https://www.foodista.com/recipe/CBKJ76FJ/shrimp-and-lemongrass-soup#1605634195522',
        'image': 'https://spoonacular.com/recipeImages/1558837-556x370.jpg',
        'imageType': 'jpg',
        'summary': 'You can never have too many hor d\'oeuvre recipes, so give Shrimp and Lemongrass Soup a try. For <b>$1.68 per serving</b>, this recipe <b>covers 11%</b> of your daily requirements of vitamins and minerals. This recipe makes 4 servings with <b>123 calories</b>, <b>9g of protein</b>, and <b>3g of fat</b> each. It is a good option if you\'re following a <b>gluten free, dairy free, and pescatarian</b> diet. It is perfect for <b>Autumn</b>. A mixture of raw shrimp, bean sprouts, scallion, and a handful of other ingredients are all it takes to make this recipe so flavorful. It is brought to you by spoonacular user <a href="/profile/renay1230">renay1230</a>. From preparation to the plate, this recipe takes roughly <b>45 minutes</b>. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/shrimp-and-lemongrass-soup-1222123">Shrimp and Lemongrass Soup</a>, <a href="https://spoonacular.com/recipes/shrimp-and-lemongrass-soup-1259313">Shrimp and Lemongrass Soup</a>, and <a href="https://spoonacular.com/recipes/shrimp-and-lemongrass-soup-659934">Shrimp and Lemongrass Soup</a>.',
        'cuisines': [
          
        ],
        'dishTypes': expect.any(Array),
        'diets': [
          'gluten free',
          'dairy free',
          'pescatarian'
        ],
        'occasions': [
          'fall',
          'winter'
        ],
        'winePairing': {
          'pairedWines': [
            'pinot grigio',
            'riesling',
            'sauvignon blanc'
          ],
          'pairingText': expect.any(String),
          'productMatches': [
            {
              'id': expect.any(Number),
              'title': expect.any(String),
              'description': expect.any(String),
              'price': expect.any(String),
              'imageUrl': expect.any(String),
              'averageRating': expect.any(Number),
              'ratingCount': expect.any(Number),
              'score': expect.any(Number),
              'link': expect.any(String)
            }
          ]
        },
        'instructions': 'Cut off the white part of the lemongrass stems, reserving tops. Cut the white part into inch long pieces and flatten with the knife. Bring chicken stock to a boil in a large stockpot and add lemongrass stem and shrimp shells. Simmer for 2 minutes, then set aside to infuse.\nStrain stock, then return to stock pot. Slice the remaining lemongrass stem and finely chop. Add to stock along with shrimp, and simmer for 3-4 minutes until shrimp is pink. Add lime juice, scallions, bean sprouts, carrots and daikon.\nStir well and season well. Serve with a mint garnish.',
        'analyzedInstructions': [
          {
            'name': '',
            'steps': [
              {
                'number': 1,
                'step': 'Cut off the white part of the lemongrass stems, reserving tops.',
                'ingredients': [
                  {
                    'id': 11972,
                    'name': 'lemon grass',
                    'localizedName': 'lemon grass',
                    'image': 'lemongrass.png'
                  }
                ],
                'equipment': [
                  
                ]
              },
              {
                'number': 2,
                'step': 'Cut the white part into inch long pieces and flatten with the knife. Bring chicken stock to a boil in a large stockpot and add lemongrass stem and shrimp shells. Simmer for 2 minutes, then set aside to infuse.',
                'ingredients': [
                  {
                    'id': 6172,
                    'name': 'chicken stock',
                    'localizedName': 'chicken stock',
                    'image': 'chicken-broth.png'
                  },
                  {
                    'id': 11972,
                    'name': 'lemon grass',
                    'localizedName': 'lemon grass',
                    'image': 'lemongrass.png'
                  },
                  {
                    'id': 11020420,
                    'name': 'pasta shells',
                    'localizedName': 'pasta shells',
                    'image': 'shell-pasta.jpg'
                  },
                  {
                    'id': 15152,
                    'name': 'shrimp',
                    'localizedName': 'shrimp',
                    'image': 'shrimp.png'
                  }
                ],
                'equipment': [
                  {
                    'id': 404752,
                    'name': 'pot',
                    'localizedName': 'pot',
                    'image': 'stock-pot.jpg'
                  },
                  {
                    'id': 404745,
                    'name': 'knife',
                    'localizedName': 'knife',
                    'image': 'chefs-knife.jpg'
                  }
                ],
                'length': {
                  'number': 2,
                  'unit': 'minutes'
                }
              },
              {
                'number': 3,
                'step': 'Strain stock, then return to stock pot. Slice the remaining lemongrass stem and finely chop.',
                'ingredients': [
                  {
                    'id': 11972,
                    'name': 'lemon grass',
                    'localizedName': 'lemon grass',
                    'image': 'lemongrass.png'
                  },
                  {
                    'id': 1006615,
                    'name': 'stock',
                    'localizedName': 'stock',
                    'image': 'chicken-broth.png'
                  }
                ],
                'equipment': [
                  {
                    'id': 404752,
                    'name': 'pot',
                    'localizedName': 'pot',
                    'image': 'stock-pot.jpg'
                  }
                ]
              },
              {
                'number': 4,
                'step': 'Add to stock along with shrimp, and simmer for 3-4 minutes until shrimp is pink.',
                'ingredients': [
                  {
                    'id': 15152,
                    'name': 'shrimp',
                    'localizedName': 'shrimp',
                    'image': 'shrimp.png'
                  },
                  {
                    'id': 1006615,
                    'name': 'stock',
                    'localizedName': 'stock',
                    'image': 'chicken-broth.png'
                  }
                ],
                'equipment': [
                  
                ],
                'length': {
                  'number': 4,
                  'unit': 'minutes'
                }
              },
              {
                'number': 5,
                'step': 'Add lime juice, scallions, bean sprouts, carrots and daikon.',
                'ingredients': [
                  {
                    'id': 11043,
                    'name': 'bean sprouts',
                    'localizedName': 'bean sprouts',
                    'image': 'bean-sprouts.jpg'
                  },
                  {
                    'id': 9160,
                    'name': 'lime juice',
                    'localizedName': 'lime juice',
                    'image': 'lime-juice.png'
                  },
                  {
                    'id': 11291,
                    'name': 'green onions',
                    'localizedName': 'green onions',
                    'image': 'spring-onions.jpg'
                  },
                  {
                    'id': 11124,
                    'name': 'carrot',
                    'localizedName': 'carrot',
                    'image': 'sliced-carrot.png'
                  },
                  {
                    'id': 11430,
                    'name': 'daikon radish',
                    'localizedName': 'daikon radish',
                    'image': 'daikon.jpg'
                  }
                ],
                'equipment': [
                  
                ]
              },
              {
                'number': 6,
                'step': 'Stir well and season well.',
                'ingredients': [
                  
                ],
                'equipment': [
                  
                ]
              },
              {
                'number': 7,
                'step': 'Serve with a mint garnish.',
                'ingredients': [
                  {
                    'id': 2064,
                    'name': 'mint',
                    'localizedName': 'mint',
                    'image': 'mint.jpg'
                  }
                ],
                'equipment': [
                  
                ]
              }
            ]
          }
        ],
        'originalId': 659934,
        'spoonacularSourceUrl': 'https://spoonacular.com/shrimp-and-lemongrass-soup-1558837'
      };

      const data = await fakeRequest(app)
        .get('/api/recipes/1558837')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    // test('updates a recipe', async() => {

    //   const expectation = 
    //   {
    //     id: 1,
    //     title: 'Mac n Cheese',
    //     food_api_id: 3,
    //     image_url: 'http://placekitten.com/200/300',
    //     note: 'test',
    //     completed: false,
    //     owner_id: 1
    //   };

    //   const data = await fakeRequest(app)
    //     .put('/api/recipes/1')
    //     .send({
    //       title: 'Test test test',
    //       food_api_id: 3,
    //       image_url: 'http://placekitten.com/200/300',
    //       note: 'test',
    //       completed: false,
    //       owner_id: 1
    //     })
    //     .set('Authorization', token)
    //     .expect('Content-Type', /json/)
    //     .expect(200);

    //   expect(data.body).toEqual(expectation);
    // });

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
