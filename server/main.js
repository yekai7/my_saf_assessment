const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mkQuery = require('./db');
const app = express();

app.use(morgan('tiny'));
app.use(cors());
const PORTNUMBER = parseInt(process.env.PORT) || 3000;

const SELECT_ALL = 'select * from book2018 limit 50'
const getAllTVshow = mkQuery(SELECT_ALL)

app.get("/api/all", (req, resp)=>{
    getAllTVshow().then(result=>{
        resp.status(200).json(result)
    })
})

app.listen(PORTNUMBER, ()=>{
    console.log(`App started, listening on ${PORTNUMBER}`)
})