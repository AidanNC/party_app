'use strict';

import * as _dotenv from "dotenv";
import express from 'express';
import * as _expressSession from "express-session";
import * as _path from "path";
import * as fs from "fs";




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


app.get('/main', (req, res) => {
    res.sendFile('main.html', { root: __dirname});
});

app.get('/secret', (req, res) => {
    res.sendFile('secret.html', { root: __dirname});
});

app.get('/secret/count', (req, res) => {
    fs.readFile('test.txt', 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        res.send({ count: data });
        
      })
    
});

app.post('/main',
    async (req, res) => {

        if(req.body["value"] == true){
            updateCount(1);
        }else{
            updateCount(-1);
        }
        //res.redirect(303, '/main');
    });


app.get('/', (req, res) => {
    res.redirect('/main');
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