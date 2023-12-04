const mongoose = require('mongoose');
require("dotenv").config();

main().catch(err => console.log(err));

async function main() {
  //await mongoose.connect("mongodb://127.0.0.1:27017/toys_db");
  //await mongoose.connect("mongodb+srv://michalgranot100:1234@toysdb.de7orna.mongodb.net/?retryWrites=true&w=majority")
  await mongoose.connect(process.env.MONGO_URL);

console.log("mongo connect!");
}

