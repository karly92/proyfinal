const openai = require("openai");
require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require('fs');
const pdf = require('pdf-parse');
const axios= require('axios');

const app = express();
const port = 3000 || process.env.PORT;
app.use(express.json());
app.use(express.static("public"));
app.use(express.static(__dirname + "/public"));

async function extractTextFromPDF(pdfFilePath) {
  const dataBuffer = fs.readFileSync(pdfFilePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

app.use(express.urlencoded({ extended: true }));
//app.use(express.static('js'));
const url = "mongodb://0.0.0.0:27017/chatbot_analysis"; // Update with your MongoDB connection URL
let collection = "";
const mongoose = require("mongoose");
const configuration = new openai.Configuration({
  organization: "",
  apiKey: "",
});
mongoose.connect("mongodb://0.0.0.0:27017/chatbot_analysis", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define a schema for chatbot responses
const conversationSchema = new mongoose.Schema({
  id: String,
  timestamp: { type: Date, default: Date.now },
  conversation: { type: Object, default: {} },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

const openaiapi = new openai.OpenAIApi(configuration);
console.log(collection);

app.get("/", (req, res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "/index.html"));
});


app.post("/chat", async (req, res) => {

  const messages = req.body.messages;
  console.log(messages);

  const model = req.body.model;
  const temp = req.body.temp;
  
const completion = await openaiapi.createChatCompletion({
    model: model,
    messages: messages,
    temperature: temp,
  });
  await res.status(200).json({ result: completion.data.choices });

  saveResponse(messages[0].content, completion.data.choices[0].message.content);
});


function saveResponse(userMessage, botResponse) {
  const conversation = new Conversation({
    id: "1000",
    timestamp: Date.now,
    conversation: {
      user: userMessage,
      chatbot: botResponse,
    },
  });

  Conversation.collection.insertOne(conversation);
}



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
