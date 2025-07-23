const mongoose = require('mongoose');
require('dotenv').config();

const dbName = process.env.DB;
const username = process.env.ATLAS_USERNAME;
const pw = process.env.ATLAS_PASSWORD;

const uri = `mongodb+srv://${username}:${pw}@abdallah-si.sazckjc.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Abdallah-Si`;
mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB connection error", err))