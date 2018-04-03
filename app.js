const axios = require("axios");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let conversation = process.env.conversation ? process.env.conversation[0].credentials : false;

var AssistantV1 = require('watson-developer-cloud/assistant/v1');
var assistant = new AssistantV1({
    version: process.env.CONVVERSION || "2018-02-16",
    username: process.env.CONVUSERID || conversation.username,
    password: process.env.CONVPASSWORD || conversation.password,
    url: process.env.CONVURL || "https://gateway.watsonplatform.net/assistant/api"
});

var workspace_id = process.env.CONVWORKSPACEID || "bf1160fe-06c3-421c-91de-324584c4265f";

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/api/callAllAPIs", (req, res) => {
  req.accepts("application/json");
  let params = req.body;
  callAssistant(params)
    .then(valueOfAssistant => {
      return res.send(valueOfAssistant);
    })
    .catch(err => {
      console.log(err);
      return res.send(err);
    });
});

function callAssistant(params) {
  return new Promise((resolve, reject) => {
    assistant.message({
        workspace_id: workspace_id,
        input: { text: params.text }
      }, function(err, response) {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      }
    )
  });
}

module.exports = app;


// Process the conversation response.
/*function processResponse(err, response) {
  if (err) {
    console.error(err); // something went wrong
    return;
  }

  if (response.intents.length > 0) {
    console.log('Detected intent: #' + response.intents[0].intent);
  }

  // Display the output from dialog, if any.
  if (response.output.text.length != 0) {
      console.log(response.output.text[0]);
  }
}*/