const request = require('supertest');
const app = require('./server'); // Import your Express app instance
const db = require('./src/db/connection'); // Import your database instance
// Import any other dependencies or setup you may need

describe('Gas Station Routes', () => {
  // Your setup code, if any
  
  test('GET /api/gas-stations returns gas stations based on filters', async () => {
    const response = await request(app)
      .get('/api/gas-stations')
      .query({
        lat: 48.43, 
        lng: -123.37,
       
      

      });

    // Assuming a successful response should have status code 200
    expect(response.status).toBe(200);
    
    // Check if the response body contains the expected properties
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          vicinity: expect.any(String),
          payment_method: expect.any(String),
          fuel_type: expect.any(String),
          lat: expect.any(Number),
          lng: expect.any(Number),
          regular_price: expect.any(Number),
          premium_price: expect.any(Number),
          diesel_price: expect.any(Number),
          rating: expect.any(Number),
        }),
      ])
    );
  });

  // Your cleanup code, if any
});
