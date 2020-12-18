var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SymbolSchema = new Schema(
    {
        name: { type: String, required: true, minlength: 2, maxlength: 4},
    }
);

module.exports = mongoose.model("Symbol", SymbolSchema);