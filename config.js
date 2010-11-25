exports.CONFIG = {
    hosts:{
       localhost : {
            port: 27017,
            databases : {
                admin : {
                    checks : [    //things that will be monitored in given db
                        {
                            name : "localhost.server.status",
                            type : "command",             //either command or query
                            command : { serverStatus:1 },
                            interval : 1,                 //in seconds
                            map: function(data) {         //extract interesting items from data and return flat object with string as keys and numeric values
                                var data = data.documents[0];
                                return {
                                    "uptime"                 :  data.uptime,
                                    "opcounters.inserts"     :  data.opcounters.insert,
                                    "opcounters.queries"     :  data.opcounters.query,
                                    "opcounters.updates"     :  data.opcounters.update,
                                    "opcounters.deletes"     :  data.opcounters.delete,
                                    "opcounters.getmores"    :  data.opcounters.getmore,
                                    "opcounters.commands"    :  data.opcounters.command,
                                    "mem.resident"           :  data.mem.resident, 
                                    "mem.virtual"            :  data.mem.virtual, 
                                    "mem.mapped"             :  data.mem.mapped, 
                                    "connections.current"    :  data.mem.mapped, 
                                    "connections.available"  :  data.mem.mapped, 
                                    "cursors.totalopen"      :  data.cursors.totalOpen, 
                                    "cursors.clientsize"     :  data.cursors.clientCursors_size, 
                                    "cursors.timedout"       :  data.cursors.timedOut,

                                };
                            }

                        },

                    ]
                },

                test: {
                    checks: [
                        {
                            name: "test.test.count",
                            type: "query",
                            collection: "test",
                            interval: 1,
                            query: {},
                        },
                        {
                            name: "test.fs.files.count",
                            type: "query",
                            collection: "fs.files",
                            interval: 1,
                            query: {},
                        },

                    ]
                }
            }
       }
    }
};
