const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

const run = async () => {
  try {
    const db = await MongoClient.connect(url);
    const dbo = db.db("mydb");
    const myobj = { name: "Company Inc", address: "Highway 37" };
    await dbo.collection("customers").insertOne(myobj);
    console.log("1 document inserted");
    db.close();
  }
  catch (err) {
    console.log("Error", err.message);
  }
}

run();
