SUMMARY: Repo môn CT219 lập trình ứng dụng .NET: bài C# cơ bản, Windows Forms quản lý sinh viên, ASP.NET MVC quản lý sách và bài thực hành MVC trên lớp.
---
## Project này là gì?

`CT219H-LaPTrinhUngDung.NET` là repo bài tập môn CT219 – Lập trình ứng dụng với .NET. README ghi đúng tên môn, sinh viên Lê Trần Hiếu Nhân, MSSV B2308203, lớp CT219H. Mục tiêu README nêu: C#, nền tảng .NET, Windows Forms. Phần “cấu trúc thư mục” trong README gần như để trống, nên mình mô tả theo cây file thật.

`QuanLySach/` là web ASP.NET MVC: `HomeController`, view Create/Edit/Delete/Details/Index, model Entity Framework `SACH`, `MyDB.edmx`, NuGet MVC 5 và EF 6. `project/QuanLiSinhVien/` mới là đồ án WinForms nặng: form đăng nhập, danh sách khoa/lớp/môn/sinh viên/người dùng, thêm-sửa kết quả học tập, tìm kiếm, báo cáo RDLC, dataset, kèm bản `src/QuanLySinhVienApp` có `AppDatabase`, `DatabaseBootstrap`, file hướng dẫn và backup SQL. Còn `project/QuanLyQuanCaPhe` ở root project, `thực hành mvc/` với `TTQLHocVien` và `TTQuanLiSach`, thư mục `trên lớp/` (DoToList, WinForms), `lập trình C# cơ bản` và `tự học`. Repo commit cả `packages/` và `obj/` nên rất nặng so với lượng code mình viết.

## Vì sao làm project này?

Môn yêu cầu vừa nắm C# console/WinForms vừa đụng ASP.NET MVC. Gom hết vào một repo giúp mình nộp và ôn đúng máy, đúng MSSV, thay vì để rải trên USB phòng máy.

## Vấn đề hoặc mục tiêu cần giải quyết

Mục tiêu là hoàn thành bài thực hành và đồ án quản lý: CRUD sách trên MVC, CRUD sinh viên/khoa/lớp/môn trên WinForms, kết nối database, có form đăng nhập. Không có bằng chứng trong repo về deploy IIS production hay nhiều người dùng thật. Một số project chỉ là bài trên lớp. Tiêu chí “xong” là mở được trên Visual Studio và chạy demo.

## Vai trò của tôi trong project

Mình là sinh viên làm bài và giữ source theo MSSV B2308203 (có file Word báo cáo trong `QuanLiSinhVien`). Đây là repo học phần cá nhân.

## Kết quả và những gì học được

Kết quả là một workspace .NET đủ WinForms và MVC để ôn thi. Bài học: README generic không thay được cây thư mục; commit `packages/` làm GitHub phình; WinForms gắn dataset/RDLC thì chạy local được nhưng khó mang máy khác nếu thiếu SQL Server. Người đọc nên kỳ vọng bài tập Visual Studio, không phải sản phẩm thương mại. Repo: https://github.com/human6004/CT219H-LaPTrinhUngDung.NET
