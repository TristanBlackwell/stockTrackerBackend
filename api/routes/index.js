var express = require('express');
var router = express.Router();

var symbol_controller = require("../controllers/symbolController");

router.get("/", symbol_controller.symbol_list);

router.post("/", symbol_controller.symbol_create);

router.post("/delete", symbol_controller.symbol_delete);

module.exports = router;
