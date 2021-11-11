const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;


//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vw8cq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority1`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {

        await client.connect();
        const database = client.db('Wood-Craft');
        const productcollection = database.collection('product');
        const ordercollection = database.collection('order');

        // GET API
        app.get('/product', async (req, res) => {
            const getdata = productcollection.find({});
            const showdata = await getdata.toArray();
            res.send(showdata);
        })

        // GET Single 
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const getId = { _id: ObjectId(id) };
            const showId = await productcollection.findOne(getId);
            res.json(showId);
        })

        // POST API

        app.post('/product', async (req, res) => {
            const add = req.body;
            const result = await productcollection.insertOne(add);
            console.log(result);
            res.json(result);
        }) 

        // DELETE ORDER API
        app.delete('/product/:id', async(req, res)=>{
            const id = req.params.id;
            const getId = {_id: ObjectId(id)};
            const deleteId = await productcollection.deleteOne(getId);
            res.json(deleteId);
        })


        // GET ORDER API
        app.get('/order', async (req, res) => {
            const getdata = ordercollection.find({});
            const showdata = await getdata.toArray();
            res.send(showdata);
        })

        // GET Single ORDER API
        app.get('/order/:id', async (req, res) => {
            const id = req.params.id;
            const getId = { _id: ObjectId(id) };
            const showId = await ordercollection.findOne(getId);
            res.json(showId);
        })

        // POST ORDER API

        app.post('/order', async (req, res) => {
            const add = req.body;
            const result = await ordercollection.insertOne(add);
            console.log(result);
            res.json(result);
        })
        
        //UPDATE ORDER API
        app.put('/order/:id', async (req, res) => {
            const id = req.params.id;
            const updatedOrder = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const update = {
                $set: {
                    name: updatedOrder.name, email: updatedOrder.email, place: updatedOrder.place, mobile: updatedOrder.mobile, members: updatedOrder.members, address: updatedOrder.address, status: updatedOrder.status 
                },
            };
            const result = await ordercollection.updateOne(filter, update, options);
            res.json(result);
        })

        // DELETE ORDER API
        app.delete('/order/:id', async(req, res)=>{
            const id = req.params.id;
            const getId = {_id: ObjectId(id)};
            const deleteId = await ordercollection.deleteOne(getId);
            res.json(deleteId);
        })

    }
    finally {
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






