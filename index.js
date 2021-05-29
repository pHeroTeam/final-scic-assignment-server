const express = require('express');
const bodyParser = require('body-parser');
const cors=require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;
require('dotenv').config();



const app = express();
app.use(bodyParser.json());
app.use(cors());

const port =process.env.PORT || 4002;

app.get('/', (req, res) => {
    res.send('Hello World!')
})




const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.w8vla.mongodb.net:27017,cluster0-shard-00-01.w8vla.mongodb.net:27017,cluster0-shard-00-02.w8vla.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-kn5rpb-shard-0&authSource=admin&retryWrites=true&w=majority`;


MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },function(err, client) {
    const collection = client.db("TeamWork").collection("TeamCollection");
    const orderCollection = client.db("TeamWork").collection("order");

    console.log("database connected successfully");

    //data set in mongodb
    app.post('/allFoodAdd', (req, res)=> {
        const food=req.body;
        collection.insertOne(food)
        .then(result=>{
        console.log(result);
        res.send(result.insertedCount>0)
        })
    })

    //data show in ui
    app.get('/showAllFoodAddClientSite',(req,res)=>{
        collection.find({})
        .toArray((err,documents)=>{
        console.log(documents);
        res.send(documents)
        })
    })

    //change status 
    app.patch('/update/:id',(req,res)=>{
        console.log(req.params.id);
        orderCollection.updateOne({_id:ObjectId(req.params.id)},{
        $set:{status:req.body.status}
        })
        .then(result=>{
        console.log(result);
        res.send(result.modifiedCount>0)
        })
    })

    // delete food
    app.delete('/delete/:id',(req,res)=>{
        collection.deleteOne({_id:ObjectId(req.params.id)})
        .then(result=>{
        console.log(result);
        res.send(result.deletedCount>0)
        })
    })


});


app.listen(port)