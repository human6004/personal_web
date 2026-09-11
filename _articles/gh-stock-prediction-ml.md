SUMMARY: Niên luận dự báo xu hướng cổ phiếu HOSE bằng ML: pipeline pandas scikit-learn, web Flask, chatbot LLM hai bước, test pytest.
---
## Project này là gì?

`stock-prediction-ml` là repo làm việc của niên luận dự báo xu hướng HOSE. GitHub ghi mô tả ngắn “học máy”. Khác repo `aicon2026-stock-prediction` (bản đóng gói nộp), đây là nơi pipeline, web và chatbot nằm trực tiếp ở root.

README mô tả luồng: CSV thô, làm sạch, feature kỹ thuật, nhãn `UP`/`NOT_UP` theo đúng phiên t+5 tăng hơn một phần trăm, chia rolling theo ngày, time-series CV trên TRAIN, chọn family trên VALIDATION, refit, đánh giá TEST một lần rồi xuất artifact. Policy ghi trong tài liệu là `rolling_recent_cv_oof_threshold`. Mốc split thật của snapshot nằm trong `models/model_metadata.json`, không hard-code mãi trong `config/settings.py`.

Cây thư mục có `config/`, `services/`, `scripts/`, `models/`, `reports/`, `experiments/`, `templates/`, `static/`, `tests/`, `docs/` và `app.py`. `requirements.txt` liệt kê pandas, numpy, scikit-learn, joblib, Flask, openpyxl, matplotlib, vnstock, openai, python-dotenv. Có thêm `requirements.lock.txt` để tái tạo môi trường.

Web Flask có nhiều hơn vài trang HTML: dự báo, evaluation, compare, screener, tuning, chat, cộng endpoint `POST /predict` và `POST /api/chat`. Chatbot gọi LLM hai lần cố định, không tool loop: lần một chọn action JSON, backend validate rồi trả câu deterministic; lần hai chỉ diễn đạt lại. Thiếu `.env` thì pipeline và trang dự báo vẫn chạy.

## Vì sao làm project này?

Mình cần một chỗ chạy lại thí nghiệm, ghi report CSV/JSON và demo cho người xem, chứ không chỉ nộp file model. Repo này cũng là lịch sử mình chỉnh protocol trước khi đóng gói bản AICON.

## Vấn đề hoặc mục tiêu cần giải quyết

Mục tiêu là không để dữ liệu tương lai rò vào TRAIN, không mở lại TEST khi chỉ refresh inference, và không đưa raw CSV hay artifact cho LLM. Tuning Lab ghi state trong `experiments/`; `experiments/archive/` là snapshot cũ, README nói không có code path đọc thư mục đó. Test pytest cần `PYTHONPATH` trỏ root vì không có `conftest.py`.

## Vai trò của tôi trong project

Mình viết pipeline, cấu hình split, phần Flask, chatbot và tài liệu `docs/GIAI_THICH_PROJECT.md`, sơ đồ kiến trúc, kiến trúc chatbot. Đây là repo cá nhân niên luận.

## Kết quả và những gì học được

Kết quả là hệ thống chạy CLI `predict_stock.py --symbol` và web local cổng 5000. Bài học: bài toán mất cân bằng nhãn khiến “luôn đoán NOT_UP” trông hay nếu chỉ nhìn accuracy; phải khóa TEST và fingerprint dữ liệu. Chatbot hai bước giúp mình không tin LLM tự tính số. Repo: https://github.com/human6004/stock-prediction-ml
