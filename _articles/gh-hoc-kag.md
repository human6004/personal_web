SUMMARY: Bộ tài liệu HTML tự học RAG, GraphRAG và Knowledge Augmented Generation: 18 bài đọc sâu, 15 bài học nhanh, kèm ghi chú research và lab CSV.
---
## Project này là gì?

`hoc-kag` là bộ tài liệu tự học tiếng Việt đi theo một trục: RAG thiếu gì, GraphRAG bù được bao nhiêu, KAG thêm gì. GitHub mô tả đúng hướng đó. Đây không phải engine KAG, mà website HTML/CSS/JS tĩnh cộng vài ghi chú và script lab.

Thư mục `kag-tai-lieu/` là site chính: `index.html`, `assets/app.js`, `assets/style.css`. Tuyến đọc sâu `bai-hoc/` từ `00-tong-quan-de-tai.html` tới `18-xu-huong-30-ngay.html` (LLM, hallucination, kiến trúc RAG, chunking, embedding, hybrid rerank, hạn chế RAG, knowledge graph, GraphRAG Microsoft, HippoRAG/LightRAG, tổng quan KAG, LLMs+SPG, builder/solver, alignment, benchmark, lab mini). Tuyến `hoc-nhanh/` có 15 bài ngắn và trang mục lục. Có trang `nguon-tham-khao/` và `_SPEC-KAG.md`.

`research/` gồm extract bài KAG, khảo sát RAG tiếng Việt, ghi chú khả thi domain. `ghi-chu/` có handoff và research tổng hợp. `lab/` có `cau_hoi_danh_gia.csv`, `tien_do.csv` và hai script Python xem/kiểm tiến độ. README nói PDF nguồn bị gitignore. Giao diện tài liệu: chữ hệ thống, dark/light, mục lục bám heading.

## Vì sao làm project này?

Đọc paper KAG dễ trộn khái niệm với RAG thường. Mình muốn một lộ trình tiếng Việt mở bằng trình duyệt, có bản “học nhanh” 15 bước rồi mới đọc sâu, để lúc ôn không phải lội nguyên paper.

## Vấn đề hoặc mục tiêu cần giải quyết

Mục tiêu là phân biệt đúng cơ chế rồi mới nghĩ tới code. README nói code minh họa không bắt buộc. Lab CSV là dữ liệu tự kiểm tra cũ. Mình không claim repo này train được model hay dựng được OpenSPG. Chỉ cần site tĩnh mở `kag-tai-lieu/index.html` hoặc `python -m http.server`.

## Vai trò của tôi trong project

Mình biên soạn cấu trúc bài, viết HTML tài liệu, sắp research notes và giữ script lab. Đây là tài liệu cá nhân mình học.

## Kết quả và những gì học được

Kết quả là một giáo trình tĩnh đủ để mình đi từ RAG tới KAG mà không phụ thuộc Notion. Bài học: tách “hiểu cơ chế” khỏi “cài cluster OpenSPG”; site tĩnh dễ chia sẻ hơn notebook. Điểm yếu là chưa phải demo chạy solver thật — muốn thí nghiệm code thì sang `kag-medical-assistant` hoặc tài liệu OpenSPG gốc. Repo: https://github.com/human6004/hoc-kag
