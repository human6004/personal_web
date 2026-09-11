SUMMARY: Repo luyện cấu trúc dữ liệu và giải thuật CT177H bằng C: list, linked list, stack, queue, sort, cây nhị phân, BST, kèm vài file tự học.
---
## Project này là gì?

`DSA` là repo C không README, dùng để luyện cấu trúc dữ liệu. Phần có tổ chức nhất nằm trong `CT177H/TMT/`, đánh số bài: đa thức, phân số, số nguyên lớn, list (`alistlib`), linked list, mã hóa (`maHoa` với `acoder.h`/`pcoder.h`), stack (con trỏ và list), queue (circle/linked/list), sort, binary tree, BST. Có thêm cụm `CK/` gom lại list, hàng đợi, ngăn xếp, cây; `GK/` bài nộp giữa kỳ; `EX5`; `PPLAN/List_Lan`.

Ngoài CT177H, `NQ/` có `Stack.h`, `Queue.h` và `BT5.c`. `Practice/StructSV` là struct sinh viên. `self_Study` có single linked list. `linhtinh/` là file ghi chú/thread/html lẻ, không phải module chính.

Nhiều header `.h` viết tay (`LinkedList.h`, `pstack.h`, `sort.h`) kèm file `main`/`testCode` và `.exe`. Đây đúng kiểu bài C ở trường: tự định nghĩa struct, tự cấp phát, tự viết hàm duyệt, chứ không dùng thư viện STL.

## Vì sao làm project này?

Môn CT177H đi từng kiểu dữ liệu. Mình cần chỗ cài list rồi mới stack/queue rồi mới cây, để lúc thi mở đúng folder thay vì một file khổng lồ.

## Vấn đề hoặc mục tiêu cần giải quyết

Mục tiêu là cài được các ADT trên C: thêm/xóa/duyệt, sort trên list, stack/queue hai cách cài, cây nhị phân và BST. Không có bộ test thống nhất, không Makefile. Một số bài có `_demo` hoặc `practice_*`. `linhtinh/` không nên hiểu thành phần sản phẩm. Mình cũng không gộp hết vào một `main.c` vì lúc thi cần mở đúng header.

## Vai trò của tôi trong project

Mình tự cài các file trong `CT177H`, `NQ`, `Practice` và `self_Study`. Đây là repo luyện tập cá nhân.

## Kết quả và những gì học được

Kết quả là kho header C đủ để mình ôn thi CT177H. Bài học: tách `CK/` như “cheat sheet” cuối kỳ hữu ích; commit `.exe` thì vô ích trên máy khác; thiếu README khiến người ngoài không biết CT177H là gì nếu chỉ nhìn tên repo `DSA`. Repo: https://github.com/human6004/DSA
