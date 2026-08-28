const make = require("../utils/crudControllerWithFile");
const Model = require("../models/Certificate");
const upload = require("../middleware/certUpload");
module.exports = make(Model, upload);
