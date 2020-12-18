var Symbol = require("../models/symbol");
const fetch = require('node-fetch');
var async = require("async");

const { body, validationResult } = require("express-validator");

exports.symbol_list = function(req, res, next) {
    
    async.parallel([
        function(callback) {
            Symbol.countDocuments({}, callback);
        },
        function(callback) {
            Symbol.find({}, callback);
        }
    ], function(err, result) {
        if (err) { console.log(err); }
        res.send({results: result})
    })
}

exports.symbol_detail = function(req, res, next) {
    res.send("symbol detail");
}

exports.symbol_create = [

    body("name", "Symbol name required").trim().isLength({ min: 2, max: 4}).escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        var symbol = new Symbol(
            { name: req.body.name }
        );

        if (!errors.isEmpty()) {
            res.json({ created: false, msg: "Validation error."});
        } else {
            Symbol.findOne({ "name": req.body.name })
                .exec( function(err, found_symbol ) {
                    if (err) { res.json({created: false, msg: "Error in creation."}) }
                    if (found_symbol) {
                        res.json({created: false, msg: "Symbol exists"});
                    } else {
                        symbol.save(function(err) {
                            if (err) { res.json({created: false, msg: "Error in creation"}); }
                            res.json({created: true, msg: "Symbol saved"});
                        })
                    }
                })
        }
    }
]

exports.symbol_delete = function(req, res, next) {
    
    console.log(req.body.name);
    Symbol.findOneAndDelete({"name": req.body.name}, function(err) {
        if (err) { res.json({ deleted: false, msg: "Error in deletion."}); }
        res.json({ deleted: true, msg: "Symbol deleted" });

    })
}