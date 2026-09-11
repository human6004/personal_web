SUMMARY: Repo thực hành lập trình web ở lớp: HTML/CSS/JS buổi đầu, rồi PHP MySQL CRUD nhân viên, techblog và quản lý bài viết theo MSSV B2308203.
---
## Project này là gì?

`Web` là repo thực hành lập trình web. README gốc viết như project HTML/CSS/JS tĩnh (index.html, css/, js/), nhưng cây file thật không phải vậy. GitHub nhận ngôn ngữ PHP. Mình viết theo những gì có trong repo, không dán README.

Thư mục `class/` mới là bài nộp. Practical session 1 là HTML: `personal.html`, `KQHT.html`, `CurriculumVitae.html`. Session 2–3 là trang `techblog.html` với CSS layout sidebar và `techblog.js`. Session 4 sang PHP/MySQL: tìm title, form thêm/xóa, dropdown ajax huyện, upload ảnh. Session 5 và `WebProgramming/` là bản techblog PHP theo folder `B2308203`: `techblog.php`, `article.php`, `category.php`, thêm/sửa/xóa bài, upload, phân trang, `db-connect.php`. `Exercise 2 (M02)/simple_crud_employee_manager` là CRUD nhân viên PHP (`create.php`, `update.php`, `delete.php`, `index.php`, `db-schema.sql`). Chapter 4 là bài JS nhỏ (show-hide, vài ex.html/js). `study mysefl/` chỉ vài HTML/CSS tự tập. `Chapter5-MySQL` gần như chỉ file Word.

## Vì sao làm project này?

Buổi lab đi từ trang tĩnh tới PHP+MySQL. Mình cần một repo giữ từng practical session để nộp và xem lại, kèm MSSV trong tên folder bài lớn.

## Vấn đề hoặc mục tiêu cần giải quyết

Mục tiêu theo tiến độ lớp: dựng HTML/CSS, thêm JS, rồi nối MySQL, CRUD, upload, ajax dropdown. README nói “mở index.html” thì không khớp repo — không có `index.html` ở root. Muốn chạy phần PHP phải có máy cục bộ (Apache/PHP/MySQL), không phải chỉ Live Server. Đây là bài tập, chưa tối ưu production; README cũng tự nói vậy ở phần ghi chú.

## Vai trò của tôi trong project

Mình làm các bài trong `class/`, bản techblog `B2308203`, và vài file tự học. Repo cá nhân theo MSSV.

## Kết quả và những gì học được

Kết quả là chuỗi bài từ CV HTML tới CMS bài viết PHP. Bài học: README viết sẵn theo mẫu dễ sai sự thật; phải nhìn `class/Practical session 5` mới thấy mình đã làm gì. PHP nối DB và upload sớm dạy mình tách `db-connect.php`, nhưng cũng để lại ảnh upload trong git. Repo: https://github.com/human6004/Web
