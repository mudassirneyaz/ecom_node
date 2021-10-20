const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const db = require('./dbConfig');
const {hashPassword} = require('./bcrypt');

app.get('/test',(req, res)=>
{
    res.send(
        {
            "name":"Mudassir",
            "email":"puranamail@gmail.com",
            "phone":"8603842059"
        }
    )
})

app.post('/signup',async(req,res)=>
{
    const body = req.body;
    body.password = await hashPassword(body.password);
    console.log("Inserting to database:", body);
    const query = db.query('INSERT INTO users SET ?', body,(err,res,field)=>
    {
        if(err){
            console.log("Query Error",err)
        }
    });
    console.log(query.sql);
    res.send(
        {
            "msg":"Data saved successfully"
        }
    )
})

app.listen(3000, ()=>
{
    console.log('server running at 3000');
})