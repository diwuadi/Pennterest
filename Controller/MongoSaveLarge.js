var MongoClient = require('mongodb').MongoClient;
var Db = require('mongodb').Db,
Server = require('mongodb').Server,
ReplSetServers = require('mongodb').ReplSetServers,
ObjectID = require('mongodb').ObjectID,
Binary = require('mongodb').Binary,
GridStore = require('mongodb').GridStore,
Grid = require('mongodb').Grid,
Code = require('mongodb').Code,
BSON = require('mongodb').pure().BSON,
assert = require('assert');
var MongoDB = require('mongodb');
var fs = require('fs');

var request = require('request');
var http = require('http');


exports.do_work = function(req, res, fileId, url){

          MongoClient.connect('mongodb://cis550:cis550@ds053688.mongolab.com:53688/cis550', function(err, db) {
                  
                  if(!err) {
                    console.log("We are connected");
                  }

                  // var fileId = 'fileId';
                  // Create a new instance of the gridstore
                  var gridStore = new GridStore(db, fileId, 'w');
                // Open the file
                  gridStore.open(function(err, gridStore) {

         // http.get('http://upload.wikimedia.org/wikipedia/commons/d/dd/Yellowstone_River_in_Hayden_Valley.jpg', function (response) {
            http.get(url, function (response) {      
                                response.setEncoding('binary');
                                
                                var image2 = '';
                  
                                console.log('reading data in chunks first');
                                response.on('data', function(chunk){
                                image2 += chunk;
                                console.log('reading data');
                            });
                                
                                response.on('end', function() {
                                        console.log('done reading data');
        
                            image = new Buffer(image2,"binary");
                            
                            // Write some data to the file
                            gridStore.write(image, function(err, gridStore) {
                              assert.equal(null, err);
        
                              // Close (Flushes the data to MongoDB)
                              gridStore.close(function(err, result) {
                                assert.equal(null, err);
        
                                    GridStore.read(db, fileId, function(err, fileData) {
                                    assert.equal(image.toString('base64'), fileData.toString('base64'));
                                    
                                    console.log('Done, writing local images for testing purposes');
                                    
                                    var fd =  fs.openSync('./' + fileId +'.jpg', 'w');
        
                                    fs.write(fd, image, 0, image.length, 0, function(err,written){
        
                                    });
        
                                    var fd2 =  fs.openSync('./copy-' + fileId +'.jpg', 'w');
                                    fs.write(fd2, fileData, 0, fileData.length, 0, function(err,written){
        
                                    });
                                    
                                    // res.writeHead(200, {
                                    //     'Content-Type': 'image/jpeg',
                                    //     'Content-Length':fileData.length});

                                    console.log("File length is " +fileData.length);
                                    //res.write(fileData, "binary");
                                    //res.end(fileData,"binary");
                                    console.log('Really done');
        
                                              });
                              });
                                    });
                                });

                                });
                  });
                  
                  

                });
        
        
        
}