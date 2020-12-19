var Symbol = require("../models/symbol");
const fetch = require('node-fetch');
var async = require("async");

const { body, validationResult } = require("express-validator");

exports.symbol_list = function(socket) {
    
    async.parallel([
        function(callback) {
            Symbol.countDocuments({}, callback);
        },
        function(callback) {
            Symbol.find({}, callback);
        }
    ], function(err, result) {
        if (err) { console.log(err); }
        socket.emit("symbol_list", result);
    })
}

exports.symbol_create = function(socket, ticker) {

    var symbol = new Symbol(
        { name: ticker }
    );

    Symbol.findOne({ "name": ticker })
        .exec( function(err, found_symbol ) {
            if (err) { res.json({created: false, msg: "Error in creation."}) }
            if (found_symbol) {
                socket.emit("created", { msg: "Symbol exists"});
            } else {
                symbol.save(function(err) {
                    if (err) { res.json({created: false, msg: "Error in creation"}); }
                    socket.emit("created", { msg: "Symbol saved" });
                })
            }
        })
}

exports.symbol_delete = function(socket, name) {
    
    Symbol.findOneAndDelete({"name": name}, function(err) {
        if (err) { console.log(err); }
        socket.emit("deleted", { msg: "Symbol deleted" });

    })
}