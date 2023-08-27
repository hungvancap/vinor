const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const axios = require("axios");
const XLSX = require("xlsx");
const cron = require("node-cron");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let data = [];

// Định nghĩa route để nhập dữ liệu từ tệp Excel
app.get("/import/:filename", (req, res) => {
  // Lấy tên tệp từ tham số đường dẫn
  const filename = req.params.filename;

  // Đọc dữ liệu từ tệp Excel
  const workbook = XLSX.readFile(filename);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  // Lưu dữ liệu vào một biến
  let myData = data;

  // Trả về dữ liệu cho client
  res.json(myData);
});

// Định nghĩa route để xuất dữ liệu ra tệp Excel
app.get("/export", async (req, res) => {
  const date = new Date();
  if (date.getDate() !== 15)
    return res
      .status(400)
      .send("Chỉ được xuất bảng lương vào ngày 15 hàng tháng");

  // Lấy dữ liệu từ API khác
  const response = await axios.get("http://localhost:3000/api/nhanvien");
  const nhanviens = response.data["NhanVien"];

  // Chuyển đổi dữ liệu thành một worksheet và thêm nó vào workbook
  const worksheet = XLSX.utils.json_to_sheet(nhanviens);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "NhanVien");

  // Tạo tên tệp theo định dạng yêu cầu và ghi workbook ra tệp
  const fileName = `BangLuongThang_${
    date.getMonth() + 1
  }_${date.getFullYear()}.xlsx`;
  XLSX.writeFile(workbook, fileName);

  // Gửi tệp cho client để tải xuống
  res.download(fileName);
});

app.listen(3001, () => console.log("Server listening on port 3001"));

// Định nghĩa một cron job để tự động xuất bảng lương vào ngày 15 hàng tháng
cron.schedule("0 0 15 * *", () => {
  axios.get("http://localhost:3001/export");
});
