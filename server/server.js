const express = require ("express");
const path = require ("path");

// constant variables
const publicPath = path.join(__dirname ,'../public');
const app = express();

//builtin middlewares
app.use(express.static(publicPath));

// app.get('/',(req,res)=>{
//     res.sendFile('/index.html');
// });


app.listen(3000,()=>{
    console.log("App start listening on port 3000");
});