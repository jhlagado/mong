const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

const run = async () => {
  try {
    const db = await MongoClient.connect(url);
    const dbo = db.db("mydb");
    const query = { address: "Park Lane 38" };
    const res = await dbo.collection("customers").find(query).toArray();
    console.log(res);
    db.close();
  }
  catch (err) {
    console.log("Error", err.message);
  }
}

run();
