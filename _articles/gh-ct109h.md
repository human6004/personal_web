SUMMARY: Repo bài tập phân tích thuật toán bằng C: sắp xếp, quy hoạch động (balo, tam giác số) và tham lam (ATM, TSP, balo), kèm PDF đề CT174.
---
## Project này là gì?

`CT109H` là repo C không README. Mô tả GitHub chỉ “phân tích thuật toán”. Cây thư mục chia ba cụm, đúng tên bài thực hành chứ không phải một ứng dụng.

`sort/` cài Bubble, Insertion, Selection, Heap, Quick (kèm biến thể), file `TH.c`, `final.c`, `data.txt`. Nhiều file `.exe` cũng bị commit. Có PDF `Baitapthuchanh_CT174_Sap xep.pdf`.

`QHD/` là quy hoạch động: `QHD_CaiBalo.txt`, `QHD_CaiBalo2.txt`, thư mục `tamGiacSo` với `TamGiacSo.c`, `TamGiacSo2.c` và file input tam giác. PDF `Baitapthuchanh_CT174_Quy hoach dong.pdf`.

`thaman/` là tham lam: `ATM/ATM.c`, `TSP/TSP.c`, `balo/CaiBaLo_1.c` tới `_3.c` kèm file txt. PDF `Baitapthuchanh_CT174_Tham an.pdf`.

Tên repo là CT109H trong khi PDF ghi CT174. Mình không đổi tên môn giúp repo; chỉ ghi đúng những gì file đang gọi.

## Vì sao làm project này?

Đây là chỗ nộp và giữ bài lab thuật toán: mỗi chiến lược một thư mục, có input txt để chạy lại. GitHub đóng vai trò backup máy lab.

## Vấn đề hoặc mục tiêu cần giải quyết

Mục tiêu là cài đúng các thuật toán trong đề: sort so sánh được, QHD balo/tam giác số, greedy ATM/TSP/balo. Không có test tự động, không có Makefile. “Chạy được” nghĩa là biên dịch file `.c` (thường bằng extension Code Runner, có `tempCodeRunnerFile.c`). Không phải thư viện thuật toán để người khác import.

## Vai trò của tôi trong project

Mình tự viết các file C trong `sort`, `QHD`, `thaman` và giữ PDF đề. Đây là repo bài tập cá nhân.

## Kết quả và những gì học được

Kết quả là một tập bài C đủ ba nhóm thuật toán cơ bản. Bài học: commit `.exe` không giúp người khác chạy trên máy khác hệ điều hành; thiếu README khiến sau này phải đoán từ tên file. Tên môn trên GitHub và trên PDF không trùng — khi kể lại phải nói thẳng chứ không chọn một mã rồi bịa. Repo: https://github.com/human6004/CT109H
