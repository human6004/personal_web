SUMMARY: Website portfolio và knowledge blog bằng Next.js: MDX, Neon Postgres, Cloudinary và khu admin, có bản public trên Vercel.
---
## Project này là gì?

`personal_web` là chính website cá nhân mình đang dùng để giới thiệu profile, project và bài viết. Đây không phải landing page tĩnh một trang, mà một ứng dụng Next.js App Router (package `personal-knowledge-portfolio`) gồm các route public Home, About, Projects, Blog, Contact và khu `/admin` để sửa nội dung.

Phần giao diện nằm trong `src/app` và `src/components`. Phần đọc dữ liệu nằm trong `src/lib`: khi có `DATABASE_URL` thì site lấy profile, post, project từ Neon Postgres; khi chưa cấu hình database thì đọc fallback từ thư mục `content/` (JSON profile và file MDX). Admin dùng session cookie, Zod để validate, và Cloudinary để upload ảnh. README trong repo mô tả đúng stack đó: Next.js, TypeScript, Tailwind, MDX, Neon, Cloudinary, Vitest.

GitHub thống kê ngôn ngữ HTML vì repo có nhiều markup và nội dung, nhưng phần mình viết để chạy production là TypeScript/React. Repo có `scripts/db-schema.mjs`, `scripts/import-content.mjs` và `scripts/sync-github.mjs` để dựng bảng, import MDX và đồng bộ project từ GitHub. Trang public hiện tại trỏ tới https://personal-web-theta-woad.vercel.app.

## Vì sao làm project này?

Mình muốn một chỗ gom profile, repo và ghi chú học tập, thay vì để rời trên GitHub và mạng xã hội. Làm website thật còn giúp mình luyện Next.js end-to-end: routing, metadata, form admin, database, upload media và test, chứ không chỉ dừng ở bài tập giao diện.

## Vấn đề hoặc mục tiêu cần giải quyết

Mục tiêu là có một site đọc được, sửa nội dung được, và deploy được. Cụ thể: trang project phải trông như case study ngắn (vai trò, stack, link repo), blog render MDX có category/tag/draft, admin không lộ secret, và production dùng Neon nên sửa bài không bắt buộc rebuild. Mình cũng cần SEO cơ bản: metadata, sitemap, robots, Open Graph. Đây vẫn là website cá nhân đang làm dở, không phải CMS đa người dùng.

## Vai trò của tôi trong project

Mình là người thiết kế content model, viết UI, nối Neon/Cloudinary, viết test Vitest cho content/admin, và soạn README hướng dẫn chạy local lẫn deploy Vercel. Toàn bộ source trong repo này là việc của mình.

## Kết quả và những gì học được

Kết quả là một portfolio chạy được local bằng `npm run dev`, có schema Neon, có admin và có bản deploy. Bài học rõ nhất: nội dung và code nên tách. File MDX trong `content/projects` chỉ là mẫu và fallback; bài GitHub trên production nằm ở bảng `projects`. Mình cũng học được phải fail-closed với mật khẩu admin mặc định, không commit `.env.local`, và không nhét HTML thô vào MDX vì renderer không biến nó thành thẻ thật. Repo: https://github.com/human6004/personal_web
