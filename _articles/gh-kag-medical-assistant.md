SUMMARY: Thử nghiệm trợ lý hỏi đáp y tế theo hướng hybrid RAG: FastAPI, Chroma, Neo4j, corpus markdown, kèm file compose OpenSPG chứ chưa phải hệ KAG hoàn chỉnh.
---
## Project này là gì?

`kag-medical-assistant` là repo Python mình đặt tên theo hướng Knowledge-Augmented Generation cho hỏi đáp y tế. README gốc chỉ đúng hai câu tiếng Anh, không mô tả kiến trúc. Phần code chạy được mình đọc được nằm trong `hybridRAG/`, không phải một app KAG OpenSPG đầy đủ.

Trong `hybridRAG` có ingestion (load markdown, clean, normalize), indexing (parser markdown/semantic, embedding, graph builder, vector Chroma/Milvus), retrieval (vector, graph, hybrid, rerank, rewrite/HyDE), LLM (NVIDIA, Gemini, Ollama, OpenAI-like) và FastAPI `api/main.py`. File API tạo app tên “GraphRAG API”, load vector index cùng graph index, nhận `POST /chat` với câu hỏi rồi gọi Retriever và AnswerGenerator. Corpus nằm ở `hybridRAG/knowledge/markdown/` gồm các file đoạn `1-66.md` tới `169-213.md` và `diseases.md`. `run_offline_phase.py` là cửa chạy index offline. `requirements.txt` kéo fastapi, chromadb, neo4j, llama-index, sentence-transformers, torch, google-genai, ollama, openai.

Root còn `docker-compose-west.yml`: stack image OpenSPG (server, MySQL, Neo4j, MinIO) lấy từ registry Aliyun. Thư mục `KAG_OpenSPG` có trên GitHub nhưng cây file recursive không thấy blob bên trong, nên mình không coi đó là mã KAG đã vendor vào repo.

## Vì sao làm project này?

Mình đang học RAG rồi GraphRAG/KAG và muốn một thí nghiệm domain y tế: có corpus, có index vector-graph, có API chat. Compose OpenSPG để khi nào dựng được server chính thức thì còn đường bật, chứ không phải mình đã ship assistant lâm sàng.

## Vấn đề hoặc mục tiêu cần giải quyết

Mục tiêu thực tế là chạy được pipeline hybrid: đưa markdown bệnh vào store, truy hồi kết hợp, gọi LLM sinh câu trả lời. API đang CORS mở tất cả origin — phù hợp dev, không phải cấu hình production. Mình không có bằng chứng trong repo về đánh giá lâm sàng, dataset bệnh viện, hay độ chính xác trên ca thật. Tên repo nói KAG; code `hybridRAG` mới là phần có module rõ.

## Vai trò của tôi trong project

Mình tổ chức thư mục hybridRAG, nối retriever với FastAPI, giữ corpus markdown và file compose. Đây là repo thử nghiệm cá nhân, không phải sản phẩm nhóm y khoa.

## Kết quả và những gì học được

Kết quả là một skeleton GraphRAG/hybrid RAG hỏi đáp trên markdown y tế, cộng file compose OpenSPG. Bài học: README một dòng dễ khiến người ngoài tưởng hệ KAG đã chạy; phải nhìn `api/main.py` và chỗ trống của `KAG_OpenSPG`. Embedding/graph index nặng dependency, không phải `pip install` là có trợ lý bác sĩ. Repo: https://github.com/human6004/kag-medical-assistant
