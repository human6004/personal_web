SUMMARY: Đồ án AI trực quan hóa tìm kiếm trên Pac-man: năm thuật toán Python FastAPI, giao diện React Vite, có test và file thuyết trình.
---
## Project này là gì?

`pac-man` là đồ án trí tuệ nhân tạo: biến mê cung Pac-man thành bài toán tìm kiếm, cài năm thuật toán rồi vẽ cây tìm kiếm để nhìn máy “chọn ô” từng bước. Repo có README và `SETUP.md` dài, kèm `KICH_BAN_BAO_VE.md` và tài liệu trong `docs/`.

Backend Python trong `backend/`: FastAPI (`api/main.py`, `api/schemas.py`) nhận JSON. Lớp game tách `state`, `operators`, `problem`, `layout`. Thư mục `search/` có BFS, DFS, UCS (uninformed) và Greedy, A-star (informed), kèm heuristic và registry theo tên thuật toán. Bản đồ text `tiny`, `small`, `medium`, `classic`. Frontend React + Vite chỉ gọi HTTP rồi vẽ canvas, cây SVG, bảng số liệu; có tab Run và Compare. `tests/` dùng pytest; `experiments/run_benchmark.py` ghi `results.csv`.

Hai bài toán README nêu rõ: `eat_all` (ăn hết food) và `path_to_cell` (đi tới một ô). GitHub có thể hiện HTML vì frontend, nhưng não thuật toán là Python.

Đây khác hẳn project `pacman-search-algorithms` trên website — bài kia là ghi chú học tập Python, repo này là đồ án có UI và API.

## Vì sao làm project này?

Học search trên giấy thì BFS và A-star dễ trộn. Mình muốn một demo thuyết trình được: chọn map, bấm Run, thấy Pac-man đi và cây lớn dần, rồi Compare để đặt các thuật toán cạnh nhau. Tách frontend/backend cũng là cách mình luyện client-server đúng nghĩa.

## Vấn đề hoặc mục tiêu cần giải quyết

Mục tiêu là cài đúng năm thuật toán, trả được đường đi kèm số node và thời gian, và frontend không tự bịa kết quả. Heuristic (manhattan, nearest/farthest food, food_count, null) phải gọi đúng bài toán. Tree recorder giới hạn số node gửi lên UI để payload không nổ, thuật toán vẫn chạy tiếp. Có test layout, rule, search và API. Đây là đồ án môn học, không phải game Pac-man chơi được với ma.

## Vai trò của tôi trong project

Mình tham gia đồ án, viết/cài phần tìm kiếm, API, giao diện chạy thử và tài liệu thuyết trình trong repo. Cấu trúc thư mục hiện tại phản ánh đúng phần mình nắm để demo.

## Kết quả và những gì học được

Kết quả là hệ thống chạy hai cổng: backend tính, frontend vẽ. Bài học: trạng thái `eat_all` phải gồm cả tập food còn lại, không chỉ vị trí Pac-man; UCS và A-star cần hàng đợi theo chi phí; DFS/Greedy không đảm bảo đường ngắn nhất. README viết rất chi tiết cho người mới — mình cố không dán lại mà chỉ kể những gì code thật sự có. Repo: https://github.com/human6004/pac-man
