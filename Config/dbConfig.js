const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const url = `mongodb+srv://${process.env.CLUSETR_USER_NAME}:${process.env.CLUSTER_PASSWORD}@cluster0.na24thz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const dbName = "notesdb";
let db;

async function main() {
  // Connect the client to the server (optional starting in v4.7)
  await client.connect();
  console.log("Server Established Successfully with MongoDB Atlas DB..");
  db = client.db(dbName);
}

main()
  .then((value) => {
    db = client.db(dbName);
    console.log("Connection with db is successfull..");
  })
  .catch(console.error);
//.finally(() => client.close());

module.exports = { client, db };
