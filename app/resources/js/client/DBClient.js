/* eslint-env browser */
/* global io */

import Config from "./ClientConfig.js";

const MongoClient = require('mongodb').MongoClient;

class DBClient {

  constructor() {
    this.client = new MongoClient(DB_URL, { useNewUrlParser: true,
      useUnifiedTopology: true });
  }

  //start DB
  start() {
    this.client.connect(function(err, db) {
      if (!err) {
        console.log("We are connected");
      }
    });
  }

  //Abrufen der gespeicherten Vorlesungen aus der MongoDB
  getCollection(collection) {
    client.connect(function(err, db) {
      if (err) throw err;
      var dbo = db.db("MSO");
      var collection = dbo.collection(collection);
      return collection;
      db.close();
    });
  }

  //Hinzufügen von Item zu MongoDB 
  addItemtoCollection(item, collection) {
    client.connect(function(err, db) {
      if (err) throw err;
      var dbo = db.db("MSO");
      var myobj = Item;
      dbo.collection(collection).insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    });
  }

  //Greifen einzelnes Item von Collection
  getItembyDescription(finddescription, collection) {
    client.connect(function(err, db) {
      if (err) throw err;
      var dbo = db.db("MSO");
      var query = { description: finddescription };
      dbo.collection(collection).find(query).toArray(function(err,
      result) {
        if (err) throw err;
        console.log(result);
        db.close();
      });
    });
  }

  //Update Item 
  updateNoteContent(finddescription, newcontent) {
    client.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("MSO");
      var myquery = { description: finddescription };
      var newvalues = { $set: { content: newcontent } };
      dbo.collection("Notes").updateOne(myquery, newvalues, function(err,
        res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
      });
    });
  }


  //stop running DB 
  stop() {
    if (this.client === undefined) {
      return;
    }
    this.client.close();
  }

}

module.exports = DBClient;