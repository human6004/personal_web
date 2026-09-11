SUMMARY: Mini social-web Soul Spaces: frontend React Vite Redux và backend Spring Boot MongoDB Cloudinary, có hướng deploy GitHub Pages cùng Render.
---
## Project này là gì?

`soulspace` là project full-stack nhỏ mình tự dựng, mô tả trên GitHub chỉ hai chữ “mini social-web”. Repo không có README gốc, nhưng tách rõ hai thư mục.

`frontend` là ứng dụng React + Vite. `package.json` dùng Redux Toolkit, React Router, axios, Tailwind, Radix UI, dnd-kit, framer-motion và react-easy-crop. Các trang thật sự có trong `frontend/src/page`: SignIn, SignUp, HomePage, ExplorePage, PostPage, PostDetailPage, SearchPage, PublicProfilePage, UserPage. Component đi kèm gồm Login, ListPost, CommentPopup, EditProfile, EditAvatar và Navigation. Cấu hình API nằm ở `frontend/src/config/api.js`.

`Blog_api` là Spring Boot 3 (Java 17, artifact `blogAPI`, package `ctu.edu.blogAPI`). `pom.xml` kéo starter web, data-mongodb, validation, spring-security-crypto, Cloudinary, springdoc OpenAPI, MapStruct và Lombok. Controller gồm Authentication, User, Blog, FileUpload; entity có User, Blog, Comment, SharedBlog. Tài liệu endpoint nằm ở `API GUIDE.md`, `openapi.json` và `docs/`.

Kèm theo `DEPLOY_GITHUB.md`, workflow `.github/workflows/deploy-frontend-pages.yml`, `render.yaml` và `Blog_api/Dockerfile`.

## Vì sao làm project này?

Mình muốn làm một sản phẩm “đủ vòng đời người dùng” hơn todo list: đăng ký, đăng nhập, hồ sơ, đăng bài, bình luận, upload ảnh. Làm cả React lẫn Spring Boot trong một repo giúp mình thấy hợp đồng API thật, rồi thử tách deploy: GitHub Pages cho frontend tĩnh, Render cho JVM backend.

## Vấn đề hoặc mục tiêu cần giải quyết

Mục tiêu là chạy được vòng auth, xem/sửa profile và avatar, tạo/sửa blog, like/comment/share ở mức API đã khai báo, và upload media qua Cloudinary. Frontend không hard-code host production mà đọc `VITE_API_BASE_URL`; backend CORS đọc `CORS_ALLOWED_ORIGINS`. `DEPLOY_GITHUB.md` ghi rõ mình đã chuyển sang HashRouter vì GitHub Pages làm refresh path bị 404. Đây là đồ án mini social, không phải mạng xã hội đang vận hành.

## Vai trò của tôi trong project

Mình tự scaffold frontend và `Blog_api`, nối Redux/axios với API, cấu hình Cloudinary/CORS/OpenAPI, và viết hướng dẫn deploy. Trên GitHub đây là repo cá nhân của mình.

## Kết quả và những gì học được

Kết quả là skeleton Soul Spaces chạy local được và có lộ trình deploy tách đôi. Bài học: tách biến môi trường sớm, HashRouter cứu refresh trên Pages, OpenAPI giảm lệch FE/BE, và làm một mình thì phải nắm cả UI lẫn cấu hình Spring. README frontend vẫn mang dấu template Vite; phần nghiệp vụ đáng tin hơn nằm ở API docs và file deploy. Repo: https://github.com/human6004/soulspace
