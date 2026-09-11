SUMMARY: Bài nộp EAI AICON 2026: dự báo xu hướng ngắn hạn cổ phiếu HOSE bằng Random Forest, kèm chatbot LLM và web Flask trong thư mục stock-prediction-ml.
---
## Project này là gì?

`aicon2026-stock-prediction` là repo mình đóng gói cho bài nộp EAI AICON 2026 (hội nghị ghi trong README: Artificial Intelligence for Communications and Networks, dự kiến 20–22/11/2026 tại Phú Quốc). Chủ đề: hỗ trợ dự báo xu hướng ngắn hạn cổ phiếu sàn HOSE bằng machine learning, kèm chatbot Action Decision dùng LLM và web demo Flask.

Repo chỉ có hai khối lớn. `shared_dataset/` chứa CSV giá HOSE thô và file roadmap niên luận. `stock-prediction-ml/` là toàn bộ hệ thống: pipeline, model, Flask, chatbot, test, báo cáo. README bảo đọc README lồng bên trong trước khi chạy. Bài toán nhị phân: mã có tăng hơn một phần trăm trong năm phiên tới hay không, nhãn `UP` / `NOT_UP`.

Snapshot README công bố model Random Forest, ngưỡng quyết định 0.48, trên TEST: accuracy 0.558, precision UP 0.328, recall UP 0.630, F1 UP 0.431, F1 NOT_UP 0.639. Baseline Always UP có F1 UP 0.420; Always NOT_UP accuracy cao hơn nhưng F1 UP bằng 0. Mình không bịa thêm số khác. README cũng nói lịch sử code trước đó nằm ở repo `human6004/stock-prediction-ml`.

## Vì sao làm project này?

Niên luận cần một artifact nộp hội nghị: dữ liệu dùng chung, số liệu TEST đã chốt, và đường chạy demo. Tách repo nộp khỏi repo làm việc giúp mình không lẫn experiment dở với bản đã publish.

## Vấn đề hoặc mục tiêu cần giải quyết

Mục tiêu là một pipeline tái lập được: làm sạch, feature kỹ thuật, gán nhãn theo phiên thị trường, chia TRAIN/VALIDATION/TEST theo thời gian, chọn model, đánh giá TEST một lần, rồi phục vụ dự báo qua CLI/Flask. Chatbot cần `.env` LLM; thiếu file đó thì trang dự báo vẫn chạy. Kết quả mang tính nghiên cứu, không phải lời khuyên đầu tư. Credential không nằm trong git.

## Vai trò của tôi trong project

Mình chuẩn bị dữ liệu dùng chung, chốt snapshot model/report, viết README nộp bài và giữ phần hệ thống trong `stock-prediction-ml/`. Đây là repo cá nhân phục vụ bài nộp.

## Kết quả và những gì học được

Kết quả là một gói nộp có số liệu TEST cụ thể và web demo. Bài học: accuracy 0.558 không “thắng thị trường”; F1 UP chỉ nhỉnh baseline Always UP một chút nên phải nêu hết bảng, không chỉ khoe một chỉ số. Tách repo nộp khỏi repo phát triển giúp mình không vô tình sửa TEST lock. Muốn xem chi tiết pipeline thì sang repo `stock-prediction-ml`. Repo: https://github.com/human6004/aicon2026-stock-prediction
