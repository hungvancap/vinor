const mongoose = require("mongoose");

const NhanVienSchema = new mongoose.Schema({
  MaNV: String,
  HoVaTen: { type: String, required: true },
  NgaySinh: Date,
  QueQuan: String,
  SDT: String,
  Email: String,
  PhongBanId: mongoose.Schema.Types.ObjectId,
  ChucVuId: mongoose.Schema.Types.ObjectId,
  Luong: Number,
  TrangThai: String,
});

NhanVienSchema.pre("save", async function (next) {
  if (!this.MaNV) {
    let MaNV;
    do {
      MaNV = `${Math.floor(Math.random() * 1000000)}`;
    } while (await NhanVien.exists({ MaNV }));
    this.MaNV = MaNV;
  }
  next();
});

const NhanVien = mongoose.model("NhanVien", NhanVienSchema);

module.exports = NhanVien;
