const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// middleware

app.use(cors());
app.use(express.json());
// ------------------>

// MongoDB connection--------------------->

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.029e7jq.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // const database = client.db("insertDB");
    // const haiku = database.collection("haiku");

    const coffeeCollection = client.db("coffeeDB").collection('coffee');
    const userCollection = client.db("coffeeDB").collection('user')

    app.get('/coffee', async(req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/coffee/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id)}
        const result = await coffeeCollection.findOne(query)
        res.send(result)
    })

    app.post('/coffee', async(req, res) => {
        const newCoffee = req.body;
        console.log(newCoffee);
        const result = await coffeeCollection.insertOne(newCoffee);
        res.send(result)
    })

    app.put('/coffee/:id', async(req, res) => {
        const updateCoffee = req.body;
        const id = req.params.id;
        const filter = { _id: new ObjectId(id)}
        const options = { upsert: true}
        const coffee = {
          $set : {
            name: updateCoffee.name,
            quantity: updateCoffee.quantity,
            supplier: updateCoffee.supplier,
            taste: updateCoffee.taste,
            category: updateCoffee.category,
            details: updateCoffee.details,
            photoUrl: updateCoffee.photoUrl
          }
        }
        const result = await coffeeCollection.updateOne(filter, coffee, options);
        res.send(result)
    })

    app.delete('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })

    // User related api 
    app.post('/user', async(req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// ------------------------------------------>

app.get('/', (req, res) => {
    res.send('coffee making server is running.................')
});

app.listen( port, () => {
    console.log(`coffee making server is running on port : ${port}`);
})

/*
DB_USER = mehedihs2015
DB_PASS = 96p3qgG9FUK8E8GB
*/
