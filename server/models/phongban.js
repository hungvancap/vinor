const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const PhongBanSchema = new mongoose.Schema({
  PhongBanId: mongoose.Schema.Types.ObjectId,
  TenPhongBan: String,
  ChucNang: String,
});

module.exports = mongoose.model("PhongBan", PhongBanSchema);
