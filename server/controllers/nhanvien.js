const mongoose = require("mongoose");
const NhanVien = require("../models/nhanvien");
const PhongBan = require("../models/phongban");
const ChucVu = require("../models/chucvu");

exports.getNhanViens = (req, res) => {
  NhanVien.find()
    .select(
      "MaNV HoVaTen NgaySinh QueQuan SDT Email PhongBanId ChucVuId Luong TrangThai"
    )
    .then((allNhanVien) => {
      return res.status(200).json({
        success: true,
        message: "Danh sách tất cả nhân viên",
        NhanVien: allNhanVien,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ. Vui lòng thử lại.",
        error: err.message,
      });
    });
};

exports.getNhanVienByMaNV = (req, res) => {
  NhanVien.findOne({ MaNV: req.params.MaNV })
    .then((nhanvien) => {
      if (!nhanvien)
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nhân viên với mã nhân viên này",
        });
      res.status(200).json({
        success: true,
        message: "Thông tin nhân viên",
        NhanVien: nhanvien,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ. Vui lòng thử lại.",
        error: err.message,
      });
    });
};

async function generateMaNV() {
  let MaNV;
  do {
    MaNV = `${Math.floor(Math.random() * 1000000)}`;
  } while (await NhanVien.exists({ MaNV }));
  return MaNV;
}

exports.createNhanVien = async (req, res) => {
  const MaNV = await generateMaNV();
  const nhanvien = new NhanVien({
    MaNV,
    HoVaTen: req.body.HoVaTen,
    NgaySinh: req.body.NgaySinh,
    QueQuan: req.body.QueQuan,
    SDT: req.body.SDT,
    Email: req.body.Email,
    PhongBanId: req.body.PhongBanId,
    ChucVuId: req.body.ChucVuId,
    Luong: req.body.Luong,
    TrangThai: req.body.TrangThai,
  });

  return nhanvien
    .save()
    .then((newNhanVien) => {
      return res.status(201).json({
        success: true,
        message: "Nhân viên mới được tạo thành công",
        NhanVien: newNhanVien,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ. Vui lòng thử lại.",
        error: error.message,
      });
    });
};

exports.updateNhanVien = (req, res) => {
  NhanVien.findOneAndUpdate({ MaNV: req.params.MaNV }, req.body, { new: true })
    .then((nhanvien) => {
      res.status(200).json({
        success: true,
        message: "Cập nhật thông tin nhân viên thành công",
        NhanVien: nhanvien,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ. Vui lòng thử lại.",
        error: err.message,
      });
    });
};

exports.deleteNhanVien = (req, res) => {
  NhanVien.findOneAndRemove({ MaNV: req.params.MaNV })
    .then((nhanvien) => {
      res.status(200).json({
        success: true,
        message: "Xóa nhân viên thành công",
        NhanVien: nhanvien,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ. Vui lòng thử lại.",
        error: err.message,
      });
    });
};

exports.filterNhanViens = async (req, res) => {
  try {
    const { keyword, phongban, chucvu, trangthai } = req.query;
    let query = {};
    if (keyword) {
      const phongbanIds = await PhongBan.find({
        TenPhongBan: new RegExp(keyword, "i"),
      }).distinct("PhongBanId");
      const chucvuIds = await ChucVu.find({
        TenChucVu: new RegExp(keyword, "i"),
      }).distinct("ChucVuId");
      query.$or = [
        { HoVaTen: new RegExp(keyword, "i") },
        { QueQuan: new RegExp(keyword, "i") },
        { PhongBanId: { $in: phongbanIds } },
        { ChucVuId: { $in: chucvuIds } },
      ];
    }
    if (phongban) query.PhongBanId = phongban;
    if (chucvu) query.ChucVuId = chucvu;
    if (trangthai) query.TrangThai = trangthai;

    const nhanviens = await NhanVien.find(query)
      .populate("PhongBanId")
      .populate("ChucVuId")
      .exec();
    res.send(nhanviens);
  } catch (err) {
    res.status(500).send(err);
  }
};
