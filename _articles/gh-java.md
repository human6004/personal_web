SUMMARY: Repo IntelliJ luyện Java OOP sớm: BaiThucHanh collection, KeThua, OOP1/OOP2 và Swing UI (login, calculator), khác lab Eclipse theo buổi.
---
## Project này là gì?

`java` là repo luyện Java nền tảng trên IntelliJ IDEA (thư mục `.idea`, module `code/code.iml`). Không README. Toàn bộ bài nằm trong `code/src`, chia theo chủ đề chứ không theo buổi lớp.

`BaiThucHanh` gồm collection và thao tác cơ bản: `arrayList`, `hashmap`, `linkedMap`, `set`, `binarySearch`, mảng một chiều, mảng đánh dấu, chuỗi, số nhị phân. `KeThua` có `Circle`, `Cylider` (đúng chính tả trong repo) và `Main_1`. `OOP1` có `SinhVien`, `NhanVien`, `ThiSinh`, `DanhSachSinhVien`, `LuongNhanVien`, `setter_getter_toString`, `tukhoa_static` kèm các `Main_*`. `OOP2` có `Account` và `Main_Account`. `UI/GUI` là Swing: BorderLayout, GridLayout, Panel, JTable, form đăng nhập/đăng ký trong `LoginFrom`, máy tính `calculator_2`, bàn cờ `chess`; `UI/projcet` (đúng tên folder) có `UI_Login` và `calcuclator`.

GitHub nhận Java. Đây là “vở OOP sớm”, khác repo Eclipse `ThayCang` và khác lộ trình số bài `TITV_JAVA`.

## Vì sao làm project này?

Mình cần chỗ gom bài tự luyện OOP trước khi lab Swing/JDBC nặng hơn. Mỗi khái niệm một thư mục: ôn inheritance vào `KeThua`, collection vào `BaiThucHanh`, GUI vào `UI`.

## Vấn đề hoặc mục tiêu cần giải quyết

Mục tiêu không phải ship sản phẩm, mà viết được class có field, getter/setter/`toString`, quan hệ cha-con, rồi mở được form Swing. Tiêu chí xong: file `OOP1`/`OOP2` chạy qua `Main_*`, ví dụ UI không crash khi mở form. Không backlog user, không deploy.

## Vai trò của tôi trong project

Mình là người duy nhất viết và sắp `code/src`, tạo module IntelliJ, từng bài GUI.

## Kết quả và những gì học được

Kết quả là kho Java OOP nhập môn: collection, inheritance, class nghiệp vụ nhỏ, Swing. Bài học: chia thư mục theo khái niệm ôn nhanh hơn chia theo ngày; thiếu README khiến sau vài tháng phải đoán ngữ cảnh — vì vậy case study này liệt kê đúng tên package. Kỳ vọng bài tập IDE, không phải ứng dụng production. Repo: https://github.com/human6004/java
