/*
    Mongo-watch:  simple mongo monitoring utility

    Usage:
        define queries or commands in config.js and run mongo-watch.js.
        you will see query results on screeni

    Requirements:
        mongo instance
        node-mongo-native node.js mongo driver

*/
var util = require('util'),
fs = require('fs'),
config = require('./config.js').CONFIG;

var Db = require('mongodb').Db,
Connection = require('mongodb').Connection,
Server = require('mongodb').Server,
BSON = require('mongodb').BSONNative;

//print query/command result
var handleResult = function(name, err, data) {
    if(err) {
        util.print(name + ": error: " + JSON.stringify(error) + "\n");
    } else {
        util.print(name + ": " + JSON.stringify(data) + "\n");
    }
}

//perform check
var handleCheck = function(server, dbconn, check) {
    if(check.type == "command") {
        setInterval(function() {
            dbconn.executeDbCommand(check.command,  function(err, data) {
                if(check.map)
                    var data = check.map(data);
                handleResult(check.name, err, data);
            });
        },
        check.interval * 1000);
    } else if(check.type == "query") {
        dbconn.collection(check.collection, function(err, collection2) {
            setInterval(function() {
                collection2.count(check.query || {}, function(err, cnt) {
                    handleResult(check.name, err, {count: cnt});
                });
            },
            check.interval * 1000);
        });
    };
};

//open database connection
var handleConn = function(server, connection, db){
    connection.open(function(err, dbconn) {
        for(check_iterator in db.checks) {
            var check = db.checks[check_iterator];
            handleCheck(server,dbconn, check);
        }
    });
    
};

//read check list from config
for(hostname in config.hosts) {
    var host = config.hosts[hostname];
    for(dbname in host.databases) {
        var server = new Server(hostname, host.port || 27017 , {});
        var db = host.databases[dbname];
        var connection = new Db(dbname, server);
        handleConn(server, connection, db);
    }
    
}

