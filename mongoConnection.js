require("dotenv").config();
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    await client.connect();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = {
  connectToMongoDB,
  getClient: () => client,
};
