SUMMARY: Repo thực hành lập trình ứng dụng Java tại CTU: Java Swing MVC CRUD sản phẩm, thử JDBC bằng Ant/Maven, calculator và thread trong TH_CTUer.
---
## Project này là gì?

`CTU_LapTrinhUngDungJava` là repo thực hành Java, mô tả GitHub chỉ “thực hành”. README gốc gần như không có. Đây là tập project NetBeans/Maven, không phải một app duy nhất.

`JavaSwingMVCCRUDPhamCuong/` là Maven Swing MVC: `App.java`, `ProductController`, `Product`/`ProductDAO`, `ProductTableModel`, `ProductView`, `DatabaseUtils`. `Thuc_Hanh_JavaSwings_JMasterIO/` có `JDBCConnection` và model `User`. `Demo_Ant_17_9_2024_testConnection` và `connectAnt` là project Ant/NetBeans thử câu SQL (`sqlStatament`, `ConnectAnt`). `testMavenConnect` có `TestConnect.java`. `TH_CTUer/` README chỉ lặp tên repo; bên trong có calculator (`Caculator.java`), demo button, `Table_Tree`, và package `Threads` (`SingleThreads`, `usingInterface`, `Main`). Tên file calculator viết sai chính tả trong repo — mình giữ nguyên khi kể.

Repo commit cả `build/` và `target/` class file, nên GitHub đếm cả bytecode.

## Vì sao làm project này?

Môn lập trình ứng dụng Java ở CTU đi từ kết nối DB tới Swing MVC. Mình giữ từng project mẫu/thử nghiệm để lúc làm CRUD không phải tạo lại classpath JDBC.

## Vấn đề hoặc mục tiêu cần giải quyết

Mục tiêu là chạy được kết nối (Ant và Maven), hiểu tách model-view-controller trên Swing, thử thread. Không có tài liệu API, không deploy web. Một số folder mang tên người hướng dẫn/mẫu (`PhamCuong`, `JMasterIO`) — mình không nhận đó là sản phẩm thương mại của mình, chỉ là bài thực hành trong repo. Product CRUD trong `JavaSwingMVCCRUDPhamCuong` là bài mình bám để hiểu DAO/TableModel, không phải shop bán hàng online.

## Vai trò của tôi trong project

Mình thực hành, chỉnh và commit các project trong repo cá nhân. Có folder bám theo hướng dẫn lớp/mẫu, có folder tự gõ (`TH_CTUer`, test connect).

## Kết quả và những gì học được

Kết quả là workspace đủ để mở lại Swing CRUD và test JDBC. Bài học: nhiều mini-project trong một repo dễ rối nếu thiếu README từng folder; đừng commit `target/`. Maven/Ant song song cho thấy cùng một việc “test connection” có thể làm bằng hai kiểu build. Repo: https://github.com/human6004/CTU_LapTrinhUngDungJava
