const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i0vmz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();

    const database = client.db("tourPlanner");
    const tourPackages = database.collection("tourPackages");
    const orderCollection = database.collection("orders");

    // GET API - ALL
    app.get('/tours', async (req, res) => {
      const cursor = tourPackages.find({});
      const tours = await cursor.toArray();
      res.send(tours);
    });
    // GET SINGLE 
    app.get('/tours/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tour = await tourPackages.findOne(query);
      res.json(tour);

    });

    // POST API
    app.post('/add-new', async (req, res) => {

      const tourInfo = req.body;
      const result = await tourPackages.insertOne(tourInfo);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    });

    // DELETE API
    app.delete('/tours/:id', async (req, res) => {

      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tour = await tourPackages.deleteOne(query);
      res.json(tour);

    });

    // POST API - ORDERS
    app.post('/orders', async (req, res) => {

      const orderInfo = req.body;
      const result = await orderCollection.insertOne(orderInfo);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    });

    // GET API - ORDERS ALL
    app.get('/orders', async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // DELETE API - ORDER
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const order = await orderCollection.deleteOne(query);
      res.json(order);

    });



  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);




// 
app.get('/', (req, res) => {
  res.send('running server');
});


// 
app.listen(port, () => {
  console.log('running server on port', port);
})