SUMMARY: Workspace tự học TITV trên Eclipse (Bai04–Bai33 trong TITV/src), có submodule ThayCang; metadata Eclipse khiến GitHub có thể hiện JavaScript.
---
## Project này là gì?

`TITV_JAVA` là workspace tự học Java theo lộ trình bài kênh TITV, mở bằng Eclipse. Không README. Code chính nằm trong `TITV/src`, đặt tên theo số bài: `bai1`, `bai2`, `bai03`, `Bai04`, `Bai06`, `Bai07`, `Bai09`… tới OOP rõ hơn như `Bai30`/`Bai32`/`Bai33` (`MyDate`), `Bai31` (`HoaDonCaPhe`). Mỗi bài thường một package nhỏ kèm `Main`, `Test` hoặc `ViDu`. `TITV/bin` chứa `.class` tương ứng.

Root có entry `ThayCang` dạng git submodule (trên contents API hiện là file gitlink), không phải copy source thầy Cang vào repo này. Repo còn commit `.metadata` workspace Eclipse — vì vậy GitHub đôi khi thống kê ngôn ngữ JavaScript (thư viện WST/JSDT trong metadata), dù phần mình học là các file `.java`.

## Vì sao làm project này?

Học trên lớp đi theo tuần; TITV đi theo số video. Mình muốn repo “luyện tay có số bài” tách khỏi `ThayCang`, tránh trộn bài lab với bài xem lại. Submodule giúp nhảy sang bài lớp khi cần so sánh cùng khái niệm (ngày tháng, hóa đơn) mà không nhân đôi source.

## Vấn đề hoặc mục tiêu cần giải quyết

Mục tiêu là bám chuỗi TITV từ cú pháp tới class nhỏ như `MyDate`, `HoaDonCaPhe`, hiểu Eclipse tách `src`/`bin`, và có chỗ chạy lại ví dụ khi quên. Không Spring, không UI sản phẩm, không deploy. Phải chấp nhận repo nặng metadata nếu lỡ commit `.metadata`.

## Vai trò của tôi trong project

Mình tự theo dõi lộ trình TITV, tự code từng `Bai*` trong `TITV/src`, tự gắn submodule và commit.

## Kết quả và những gì học được

Kết quả là workspace tự học có dấu số bài, khác `java` (chia OOP/UI IntelliJ) và khác `ThayCang` (chia `buoi01`–`buoi5`). Bài học: primary language JS trên GitHub phản ánh file IDE, không có nghĩa đây là dự án frontend. Người đọc nên kỳ vọng bài tập Eclipse/TITV. Repo: https://github.com/human6004/TITV_JAVA
