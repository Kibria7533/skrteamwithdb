const express=require('express');
const app=express();
const bp = require("body-parser");
const cors = require("cors");
const mongoose=require('mongoose');
const path = require("path");

require('dotenv').config()




app.use(bp.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')))

const uri = 'mongodb+srv://kibria:kibria123@cluster0.ak8uw.mongodb.net/skrteam?retryWrites=true&w=majority'
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.use(require("./routes/users"));

if (process.env.NODE_ENV === "production") {

    app.use(express.static("client/build"));
   app.get('/*', function(req, res) {   
    res.sendFile(path.join(__dirname, 'client','public','index.html'), function(err) {
      if (err) {
        console.log(err);
        res.status(500).send(err)
      }
    })
  })
  }

app.listen(process.env.PORT||8000,()=>{
    console.log('server started');
})