SUMMARY: Repo thực hành theo tuần môn đồ thị bằng C: BFS, DFS, liên thông, Dijkstra, Bellman-Ford, thứ tự topo, Kruskal, Prim, kèm PDF bài nộp.
---
## Project này là gì?

`CT175H` là repo C không README, sắp theo tuần học. Nhìn folder là biết đây là bài thực hành lý thuyết đồ thị, không phải thư viện graph generic.

`Tuan 1` chủ yếu PDF tự học (đẳng cấu, biểu diễn đồ thị). `Tuan 2` còn bài C rất cơ bản: hello world, tổng hai số, ma trận, tam giác — kiểu khởi động IDE. `Tuan 3` có `DSC.c` (danh sách cung/kề). `Tuan 4` BFS vô hướng, BFS duyệt toàn bộ, DFS. `Tuan 5` dày nhất: cây duyệt, kiểm tra liên thông, đếm bộ phận liên thông, chu trình, đồ thị phân đôi, Tarjan/liên thông mạnh, vài bài áp dụng (come and go, trust group). `Tuan 6, 7` Moore-Dijkstra, mê cung số, Bellman-Ford, extended traffic, PDF Floyd-Warshall. `Tuan 8` thứ tự topo, xếp hạng, quản lý dự án, chia kẹo, cân đá. `Tuan 9` Kruskal, Prim, ứng dụng cây khung. `Tuan 10` PDF Chu-Liu/Edmonds. Thư mục `code/` có `bell.c`, `krus.c`, `mo.c`; `28tech/` có thêm DFS C++.

Hầu hết bài là file `ex1.c` / `10a.c` kèm `.exe` và PDF “Attempt review” từ Moodle.

## Vì sao làm project này?

Môn chạy theo tuần trên hệ thống bài tập. Mình cần giữ đúng tên bài để đối chiếu đề và code khi ôn, chứ không gộp thành một project graph duy nhất.

## Vấn đề hoặc mục tiêu cần giải quyết

Mục tiêu là từng bài tuần: biểu diễn đồ thị, duyệt, liên thông, đường đi ngắn nhất, thứ tự topo, cây khung. Input/output theo đề, không có framework test. Một số tuần chỉ có PDF không có `.c`. Không deploy, không UI.

## Vai trò của tôi trong project

Mình tự gõ các file C theo tuần và lưu PDF review. Đây là nhật ký lab cá nhân.

## Kết quả và những gì học được

Kết quả là workspace đủ để mình lần từ BFS tới Prim trên cùng kiểu đề C. Bài học: đặt tên folder tiếng Việt có dấu thì git vẫn giữ được nhưng khó gõ lệnh; commit `.exe` và PDF review làm repo nặng. Tuần 2 nhắc mình lab đồ thị vẫn bắt đầu từ I/O C, đừng kể như mình viết graph engine. Repo: https://github.com/human6004/CT175H
