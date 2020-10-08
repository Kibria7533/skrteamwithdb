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
    app.get('/webhook', (req, res) => {

      // Your verify token. Should be a random string.
      let VERIFY_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
        
      // Parse the query params
      let mode = req.query['hub.mode'];
      let token = req.query['hub.verify_token'];
      let challenge = req.query['hub.challenge'];
        
      // Checks if a token and mode is in the query string of the request
      if (mode && token) {
      
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
          
          // Responds with the challenge token from the request
          console.log('WEBHOOK_VERIFIED');
          res.status(200).send(challenge);
        
        } else {
          // Responds with '403 Forbidden' if verify tokens do not match
          res.sendStatus(403);      
        }
      }
    });
   app.get('/*', function(req, res) {   
    res.sendFile(path.join(__dirname, 'client','public','index.html'), function(err) {
      if (err) {
        console.log(err);
        res.status(500).send(err)
      }
    })
  })

  }


  app.post('/webhook', (req, res) => {  
 
    let body = req.body;
  
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
  
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
  
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });
 
app.listen(process.env.PORT||8000,()=>{
    console.log('server started');
})