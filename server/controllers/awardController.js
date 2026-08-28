const make = require("../utils/crudControllerWithFile");
const Model = require("../models/Award");
const upload = require("../middleware/certUpload");
module.exports = make(Model, upload);
