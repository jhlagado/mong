const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

const run = async () => {
  try {
    const db = await MongoClient.connect(url);
    const dbo = db.db("mydb");
    const delOK = await dbo.collection("customers").drop();
    if (delOK) console.log("Collection deleted");
    db.close();
  }
  catch (err) {
    console.log("Error", err.message);
  }
}

run();
