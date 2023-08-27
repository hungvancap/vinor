const express = require("express");
const nhanvienController = require("../controllers/nhanvien");

const router = express.Router();

router.get("/nhanvien", nhanvienController.getNhanViens);

router.post("/nhanvien", nhanvienController.createNhanVien);

router.put("/nhanvien/:MaNV", nhanvienController.updateNhanVien);

router.delete("/nhanvien/:MaNV", nhanvienController.deleteNhanVien);

router.get("/nhanvienfilter", nhanvienController.filterNhanViens);

router.get("/nhanvien/:MaNV", nhanvienController.getNhanVienByMaNV);

module.exports = router;
