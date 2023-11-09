const express = require('express');
const cors = require('cors');
// const jwt = require("jsonwebtoken");//npm i jsonwebtoken
const app = express();
// const cookieParser = require('cookie-parser')
const port = process.env.port || 5000;
require('dotenv').config()

// middleware
// const corsOptions = {
//   origin: 'https://project-eleven-f9486.web.app',
//   // other options if needed
// };

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

    // // jwt middleware
    // const verify = async(req,res,next) =>{
    //   // cookies ache kina check koro
    //   const token = req.cookies?.token;
    //   if(!token){
    //     res.status(401).sent({status : "unAuthorized Access", code:"401"})
    //   }
    //   jwt.verify(token, process.env.Secret_key,(error,decode)=>{
    //     if(error){
    //       res.status(401).sent({status : "unAuthorized Access", code:"401"})
    //     }else{
    //       // console.log(decode);
    //       req.decode = decode;
    //     }
    //   });
    //   next();
    // }

    // database
    const database = client.db("bookDB");
    const productCollection=database.collection("book");
    const borrowCollection=database.collection("borrowBook");
    
    // Add error handling
    try {
      // Attempt to create the "catagorie" collection
      await borrowCollection.insertOne({}); // This will not actually insert data, but it will create the collection
       // This will not actually insert data, but it will create the collection
      console.log("Collection 'catagorie' created successfully.");
    } catch (error) {
      console.error("Error creating 'catagorie' collection:", error);
    }
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

    app.get('/addborrow',  async(req,res)=>{
      const cursor = borrowCollection.find();
      const result = await cursor.toArray();
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

    // app.post("/jwt", async(req,res)=>{
    //   const body = req.body;
    //   // jwt.sign("payload","secretKey","expireInfo");
    //   const token = jwt.sign(body,process.env.Secret_key, {expiresIn : "10h" });
    //   const expirationDate = new Date();
    //   expirationDate.setDate(expirationDate.getDate() + 7)
    //   res.cookie ("token",token,{
    //     httpOnly:true,
    //     secure: false,
    //     expires:expirationDate,
    //   }).send({msg:"Succeed"})
    //   // res.send({body,token});
    // })


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
    client.db("admin").command({ ping: 1 });
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