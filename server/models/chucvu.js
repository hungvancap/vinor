const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const ChucVuSchema = new mongoose.Schema({
  ChucVuId: mongoose.Schema.Types.ObjectId,
  TenChucVu: String,
  ThamQuyen: String,
});

module.exports = mongoose.model("ChucVu", ChucVuSchema);
