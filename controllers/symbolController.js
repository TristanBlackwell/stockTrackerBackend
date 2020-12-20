var Symbol = require("../models/symbol");
var async = require("async");

// Get ticker count, all tickers and send to client
exports.symbol_list = function(socket) {
    
    async.parallel([
        function(callback) {
            Symbol.countDocuments({}, callback);
        },
        function(callback) {
            Symbol.find({}, callback);
        }
    ], function(err, result) {
        if (err) { 
            console.log(err); 
            socket.emit("symbol_list", {data: err, msg: "error"})
        } else {
            console.log("tickers sent")
            socket.emit("symbol_list", {data: result, msg: "success"});
        }
    })
}

// add new ticker to DB
exports.symbol_create = function(socket, ticker) {

    if (ticker.length < 2 || ticker.length > 5) {
        console.log("validation error")
        socket.emit("created", {data: "validation error", msg: "error"})
    } else {
        var symbol = new Symbol(
            { name: ticker }
        );

        Symbol.findOne({ "name": ticker })
        .exec( function(err, found_symbol ) {
            if (err) { 
                console.log("error in request")
                socket.emit("created", {data: err, msg: "error"}) 
            }
            if (found_symbol) {
                console.log("symbol already exists")
                socket.emit("created", { data: err, msg: "error"});
            } else {
                symbol.save(function(err) {
                    if (err) { 
                        console.log("error in creation")
                        socket.emit("created", { data: err, msg: "error" }); 
                    }
                    console.log("symbol created")
                    socket.emit("created", { data: null, msg: "success" });
                })
            }
        })
    }
}

// Remove ticker from DB
exports.symbol_delete = function(socket, name) {
    
    Symbol.findOneAndDelete({"name": name}, function(err) {
        if (err) { console.log("error in deletion"); }
        socket.emit("deleted", { data: null, msg: "success" });

    })
}