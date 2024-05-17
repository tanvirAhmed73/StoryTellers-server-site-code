const express = require('express');
const cors = require('cors');
// const jwt = require("jsonwebtoken");//npm i jsonwebtoken
const app = express();
// const cookieParser = require('cookie-parser')
const port = process.env.PORT || 5000;
require('dotenv').config()



// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
// app.use(cookieParser());




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
    // client.connect();

    

    // database
    const database = client.db("bookDB");
    const productCollection=database.collection("book");
    const borrowCollection=database.collection("borrowBook");
    const audioBooksCollection=database.collection("audioBooks");
    
    
    // add product of get
    app.get('/book', async(req,res)=>{
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/audioBooks', async(req,res)=>{
      const cursor = audioBooksCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/book/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    app.get('/addborrow',  async(req,res)=>{
      const email = req.query.email;
      
      console.log('Received request for email:', email);

      const query = {email: email};
      const result = await borrowCollection.find(query).toArray();
      console.log('Result from MongoDB:', result);

      res.send(result);
    })


    

    // add to borrow section
    app.post('/addborrow',  async(req,res)=>{
      try{
        const addborrow = req.body;
        const result = await borrowCollection.insertOne(addborrow);
        res.send(result);
      }
      catch(error){
        console.log(error);
        res.send(error); 
      }
      
  })


 //quantity of the book update after borrow the book
 app.patch('/book/:id', async(req,res)=>{
  const item =req.body 
  console.log(item)
  const id = req.params.id;
  const filter = { '_id': new ObjectId(id) };
  const updatedDoc ={
    $set:{
      quantityOfTheBook: item.quantity
    }
  }
  const result = await productCollection.updateOne(filter,updatedDoc);
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

    app.delete('/addborrow/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await borrowCollection.deleteOne(query);
      res.send(result);
    })

  


    // add product
        // res.status(401).sent({status : "unAuthorized Access", code:"401"})
      app.post('/book',  async(req,res)=>{
      try{
        const newBook = req.body;
        const result = await productCollection.insertOne(newBook);
        res.send(result);
      }catch(error){
        console.log(error);
        res.send(error); 
      }
      
  })
    // Send a ping to confirm a successful connection
    // client.db("admin").command({ ping: 1 });
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