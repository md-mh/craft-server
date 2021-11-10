const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = 5000;


//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vw8cq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority1`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{

        await client.connect();
        const database = client.db('siteDb');
        const table = database.collection('data');

        // GET API
        app.get('/show', async (req,res)=>{
            const getdata = table.find({});
            const showdata = await getdata.toArray();
            res.send(showdata);
        })

        // GET Single 
        app.get('/show/:id', async(req,res)=>{
            const id = req.params.id;
            const getId = {_id: ObjectId(id)};
            const showId = await table.findOne(getId);
            res.json(showId);
        })

        // POST API

        app.post('/show', async(req, res)=>{
            const add = req.body;
            console.log("Add Post Api", add);

            const result = await table.insertOne(add);
            console.log(result);
            res.json(result);
        })

        // DELETE API
        app.delete('/show/:id', async(req, res)=>{
            const id = req.params.id;
            const getId = {_id: ObjectId(id)};
            const deleteId = await table.deleteOne(getId);
            res.json(deleteId);
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Server...')
})
app.listen(port, () => {
    console.log("Running port", port)
})






