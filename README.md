# Personal Knowledge Portfolio

Website cá nhân kết hợp portfolio và knowledge blog, dùng để giới thiệu bản thân,
lưu lại project, viết ghi chú học tập và quản lý nội dung qua một khu admin nhỏ.

Dự án được xây theo hướng sạch, dễ mở rộng và phù hợp để deploy lên Vercel. Nội
dung có thể đọc trực tiếp từ file MDX trong repo khi chạy local, hoặc lấy từ
Neon Postgres khi cấu hình database.

## Tính năng chính

- Trang public gồm `Home`, `About`, `Projects`, `Blog` và `Contact`.
- Portfolio project được trình bày như case study ngắn: vai trò, stack, trạng thái,
  link repo/demo và các điểm nổi bật.
- Blog hỗ trợ MDX, category, tag, ảnh cover, draft và thời gian đọc tự động.
- Khu admin tại `/admin` để đăng nhập, tạo/sửa bài viết, project và profile.
- Hỗ trợ Neon Postgres cho nội dung động trên production.
- Có fallback nội dung từ thư mục `content/` khi chưa cấu hình database.
- SEO cơ bản: metadata, canonical URL, sitemap, robots và Open Graph image.
- Test bằng Vitest cho các phần xử lý content, admin và component quan trọng.

## Tech stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- MDX
- Neon Postgres
- Cloudinary
- Zod
- Vitest + Testing Library
- Phosphor Icons
- Motion

## Cấu trúc thư mục

```text
src/app/                 App Router pages, API routes và admin routes
src/components/          UI components cho layout, cards, admin forms
src/lib/                 Content loader, profile, metadata, auth, DB helpers
content/profile.json     Nội dung profile mặc định
content/posts/           Bài viết MDX
content/projects/        Project MDX
scripts/                 Script tạo schema và import content lên Neon
public/images/           SVG asset dùng trong portfolio và blog
```

## Chạy local

Yêu cầu: Node.js và npm.

```powershell
git clone <repo-url>
cd personal_web
npm install
Copy-Item .env.local.example .env.local
npm run dev
```

Mở `http://localhost:3000` để xem website.

Nếu chỉ muốn xem trang public bằng dữ liệu trong `content/`, có thể để trống
`DATABASE_URL`. Nếu muốn dùng `/admin` và lưu nội dung động, cần cấu hình Neon.

## Biến môi trường

Tạo file `.env.local` từ `.env.local.example`:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
ADMIN_PASSWORD=change-me
ADMIN_SESSION_SECRET=change-me-long-random-string
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_FOLDER=personal-web
```

| Biến | Ý nghĩa |
| --- | --- |
| `DATABASE_URL` | Connection string của Neon Postgres. Cần cho admin và nội dung động. |
| `ADMIN_PASSWORD` | Mật khẩu đăng nhập `/admin`. |
| `ADMIN_SESSION_SECRET` | Secret để ký session cookie admin. |
| `NEXT_PUBLIC_SITE_URL` | URL public dùng cho metadata, canonical URL và Open Graph. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name. Dùng ở frontend cho upload widget và image delivery. |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | Cloudinary API key public dùng bởi upload widget. |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret chỉ dùng ở server để ký upload và đọc media library. Không commit biến này. |
| `CLOUDINARY_UPLOAD_FOLDER` | Folder gốc trên Cloudinary, mặc định nên là `personal-web`. |

Không commit `.env.local` vì file này chứa secret.

## Thiết lập Cloudinary

1. Vào [Cloudinary Console](https://console.cloudinary.com/) hoặc [Sign up free](https://cloudinary.com/users/register_free).
2. Đăng nhập bằng Google, GitHub hoặc email.
3. Trong Dashboard, tìm phần API credentials hoặc Product environment và copy:
   - `Cloud name`
   - `API key`
   - `API secret`
4. Dán các giá trị này vào `.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_FOLDER=personal-web
```

`CLOUDINARY_API_SECRET` là secret server-side: không commit, không đưa vào client,
và không thêm prefix `NEXT_PUBLIC_`. Project dùng signed upload qua `/admin`, nên
không cần tạo unsigned upload preset trong Cloudinary.

Khi deploy Vercel, vào Project Settings -> Environment Variables, thêm đủ bốn biến
Cloudinary trên cho Production/Preview rồi redeploy.

## Thiết lập Neon

Sau khi có `DATABASE_URL`, chạy:

```powershell
npm run db:schema
npm run db:import
```

`db:schema` tạo bảng `profiles`, `posts`, `projects` và index cần thiết.
`db:import` đưa dữ liệu từ `content/profile.json`, `content/posts/` và
`content/projects/` lên Neon.

## Quản lý nội dung

- Public site đọc từ Neon khi có `DATABASE_URL`.
- Nếu không có `DATABASE_URL`, public site đọc nội dung fallback trong `content/`.
- `/admin` dùng để tạo và chỉnh sửa profile, post, project trên database.
- `/admin/media` upload ảnh lên Cloudinary ngay; trong form post/project/profile,
  ảnh local chỉ upload khi bấm Save.
- Đặt `draft: true` để ẩn post/project khỏi trang public.
- Content thay đổi qua admin có thể hiển thị ngay nếu production đang dùng Neon.
- Code, UI hoặc asset thay đổi vẫn cần commit, push và deploy lại.

## Lệnh hữu ích

```powershell
npm run dev
npm run build
npm run start
npm run test
npm run test:coverage
npm run db:schema
npm run db:import
```

## Deploy

Project phù hợp để deploy lên Vercel:

1. Push repo lên GitHub.
2. Import repo vào Vercel.
3. Thêm các biến môi trường production: `DATABASE_URL`, `ADMIN_PASSWORD`,
   `ADMIN_SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`, và các biến Cloudinary.
4. Chạy schema/import cho Neon nếu database production chưa có dữ liệu.
5. Deploy.

Khi website đã dùng Neon, việc sửa nội dung trong `/admin` không cần redeploy.
Những thay đổi trong source code vẫn đi qua luồng GitHub -> Vercel như bình
thường.
