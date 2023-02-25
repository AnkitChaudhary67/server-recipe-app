require('dotenv').config();
const express=require('express');
const cors=require('cors')

const app=express();
const port=process.env.PORT

require('./db/db');
const router=require('./route')


app.use(cors());
app.use(express.json());
app.use(router);


app.get('/', (req,res)=>{
    res.json('server start')
})



app.listen(port,()=>{
    console.log(`Port running at ${port}`);
})


