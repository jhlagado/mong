const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

const run = async () => {
  try {
    const db = await MongoClient.connect(url);
    const dbo = db.db("mydb");
    await dbo.createCollection("customers")
    console.log("Collection created!");
    db.close();
  }
  catch (err) {
    console.log("Error", err.message);
  }
}

run();
