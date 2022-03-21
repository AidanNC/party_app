'use strict';

import * as _dotenv from "dotenv";
import express from 'express';
import * as _expressSession from "express-session";
import * as _path from "path";
import * as fs from "fs";
import pkg from 'mongodb';
import { exit } from "process";
const { MongoClient } = pkg;

//const uri = "mongodb+srv://super:uKs1KLMWfAXvse4b@cmu-party-app.bflkv.mongodb.net/cmu-party-app?retryWrites=true&w=majority"
const uri = "mongodb+srv://super:uyOXWHfYTKjUA3zQ@cmu-party-app.bflkv.mongodb.net/test?retryWrites=true&w=majority"
//const uri = process.env.MONGODB_URI;


const dotenv = _dotenv["default"];
dotenv.config();
const expressSession = _expressSession["default"];
const path = _path["default"];


function updateCount(value){
    fs.readFile('test.txt', 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        let content = parseInt(data) + value
        fs.writeFile('test.txt', content, err => {
            if (err) {
              console.error(err)
              return
            }
            //file written successfully
          })
      })
};



const app = express();


app.use(express.json());
app.use(express.urlencoded({ 'extended': true })); // allow URLencoded data


const __dirname = process.cwd();
app.use(express.static(__dirname));


async function update(value) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    
    try {
        await client.connect();
    
        const database = client.db('test');
        const attending = database.collection('attending');

        const myobj = 
            {
                title:'solo',
                count:value
            }
            ;
        const res = await attending.insertOne(myobj); 
        /*
        let temp = await attending.findOne({ "title": "solo" } );
        
        if(temp == null){
            const myobj = 
            {
                title:'solo',
                count:0
            }
            ;
            const res = await attending.insertOne(myobj); 
            temp = await attending.findOne({ "title": "solo" } );
        } 
        
        
        //collection.find({ "title": "solo" })
        //console.log(database.collection("attending").find(  { "title": "solo" } ))

        //temp = await attending.findOne({ "title": "solo" } );
    
        //console.log(temp);
        const updateDoc = {
            $set: {
              count: temp['count'] +value
            },
          };
        const result = await attending.updateOne({ "title": "solo" }, updateDoc);
        */
        
    } catch(err) {
        console.log(err);
    }
    finally {
    // Ensures that the client will close when you finish/error
        await client.close();
    }
}
app.get("/db", async function (req, res) {
    update(0);
    res.redirect('/main');
  });

app.get('/', (req, res) => {
    res.sendFile('main.html', { root: __dirname});
});

app.get('/secret', (req, res) => {
    res.sendFile('secret.html', { root: __dirname});
});

app.get('/secret/count', async (req, res) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    
    try {
        await client.connect();
    
        const database = client.db('test');
        const attending = database.collection('attending');
        //let temp = await attending.findOne({ "title": "solo" } );
        //const cursor = attending.find({"title":"solo"});
        //let total = 0
        //await cursor.forEach(element => total+=element['count']);
        const pluscount = await attending.countDocuments({"count":1});
        const minuscount = await attending.countDocuments({"count":-1});
        

        res.send({ count: pluscount-minuscount });
        
    } catch(err) {
        console.log(err);
    }
    finally {
    // Ensures that the client will close when you finish/error
        await client.close();
    }
    
    
});

app.post('/main',
    async (req, res) => {

        if(req.body["value"] == true){
            update(1);
        }else{
            update(-1);
        }
        //res.redirect(303, '/main');
    });



app.get('*', (req, res) => {
    res.send(JSON.stringify({ result: 'command-not-found' }));
});


let port = process.env.PORT;
if (port === null || port === "" || port === undefined) {
    port = 8080;
}
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});