const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017/';

const run = async () => {
  try {
    const db = await MongoClient.connect(url);
    const dbo = db.db('mydb');
    const res = await dbo.collection('customers').findOne({});
    console.log(res.name);
    db.close();
  } catch (err) {
    console.log('Error', err.message);
  }
};

run();
