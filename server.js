var express = require('express');
var app = express();


/*
//Mongo DataBase Config
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://192.168.2.156:27017';
var insertData = {};
var dataRequest;
*/

// Socket Server
var server = app.listen(8085);
console.log("Socket Node running on port 8085...");

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

// New Socket Connection
function newConnection(socket) {
  var id = socket.id;
  console.log("new connection: " + socket.id);

//  socket.on('getData', dataRelease);

  // Find Data Function
  function dataRelease(boolean) {
    console.log("Socket boolean message received...");
    if (boolean == "true") {
      MongoClient.connect(url, function(err, client) {
        if (client) {
          var db = client.db('learning_mongo');
          var collection = db.collection('testData5');
          collection.find({}).toArray(function(err, dataResult) {
            if (err) throw err;
            socket.emit('dataRelease', dataResult);
            console.log(dataResult);
            console.log("Data Release Sent.")
            client.close();
          });
        }
      })
    }
  }


//  socket.on('dataPoint', dataAdd);

  // Write Data Function
  function dataAdd(data1) {
    MongoClient.connect(url, function(err, client) {
      if (client) {
        var db = client.db('NMPL');
        var collection = db.collection('NMPL_tinfoil');
        //console.log(data1)
        collection.insertOne(data1, function(err, res) {
          if (err) throw err;
          client.close();
        });
      } else if (err) {
        console.log("ERROR: " + err);
        }
    });
  }






  socket.on('dataMessage', dataMsg);

  function dataMsg(data1) {
    socket.broadcast.emit('dataMessage', data1);
    console.log(data1);
  }
}
