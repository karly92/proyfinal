const openai = require("openai");
require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const port = 3000 || process.env.PORT;
app.use(express.json());
app.use(express.static("public"));
app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }));
//app.use(express.static('js'));
const url = "mongodb://0.0.0.0:27017/chatbot_analysis"; // Update with your MongoDB connection URL
let collection = "";
const mongoose = require("mongoose");
const configuration = new openai.Configuration({
  organization: "org-baZmo0sBKb0daPqfgY1veI06",
  apiKey: "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",
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
  //  console.log("karlota")
  //console.log(req)
  const messages = req.body.messages;
  const model = req.body.model;
  const temp = req.body.temp;
  const completion = await openaiapi.createChatCompletion({
    model: model,
    messages: messages,
    temperature: temp,
  });
  await res.status(200).json({ result: completion.data.choices });
  console.log(completion);
  //console.log(res)
  saveResponse(messages[0].content, completion.data.choices[0].message.content);
});

function saveResponse(userMessage, botResponse) {
  console.log("dlmdkdmlfmkfmk");
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
