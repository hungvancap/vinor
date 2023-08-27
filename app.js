// Import các thư viện cần thiết
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Import các route chính
const mainRoutes = require("./server/routes/main");

// Khởi tạo và cấu hình ứng dụng Express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cấu hình kết nối với cơ sở dữ liệu MongoDB sử dụng Mongoose
mongoose
  .connect("<MONGODB_URL>", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "CongTyDB",
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Error connecting to database");
  });

// Định nghĩa cổng mà ứng dụng sẽ lắng nghe
const port = 3000;

// Định nghĩa các route cho ứng dụng
app.use("/api/", mainRoutes);

// Khởi động server và lắng nghe trên cổng đã định nghĩa
app.listen(port, () => {
  console.log(`Our server is running on port ${port}`);
});
