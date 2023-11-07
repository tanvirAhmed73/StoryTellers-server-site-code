const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.port || 5000;
require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q1fcrjh.mongodb.net/?retryWrites=true&w=majority`;


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

    const database = client.db("bookDB");
    const productCollection=database.collection("book");

    // add product of get
    app.get('/book', async(req,res)=>{
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/book/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);
    })


    // updated product
    app.put('/book/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert : true};
      const updatedproduct = req.body;
      const product = {
        $set : {
          bookName : updatedproduct.bookName,
          authorName : updatedproduct.authorName,
          bookImage : updatedproduct.bookImage,
          quantityOfTheBook : updatedproduct.quantityOfTheBook,
          description : updatedproduct.description,
          category : updatedproduct.category,
          rating : updatedproduct.rating,
        }
      }
      const result = await productCollection.updateOne(filter, product, options);
      res.send(result)
    })


    // add product
    app.post('/book', async(req,res)=>{
      const newBook = req.body;
      const result = await productCollection.insertOne(newBook);
      res.send(result);
      
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











app.get('/', (req,res)=>{
    res.send('brand store server is running')
})

app.listen(port, (req,res)=>{
    console.log(`brand store server is running ${port}`)
})