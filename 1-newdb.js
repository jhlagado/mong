const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/mydb";

const run = async () => {
  try {
    const db = await MongoClient.connect(url);
    console.log("Database created!");
    db.close();
  }
  catch (err) {
    console.log("Error", err.message);
  }
}

run();
