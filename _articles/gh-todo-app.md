SUMMARY: Task Dashboard full-stack: React Vite TypeScript Tailwind phía client, Express Prisma SQLite phía server, dựng lại từ file todo.html cũ.
---
## Project này là gì?

`todo-app` là task manager full-stack mình dựng lại từ file `todo.html` gốc (file này vẫn giữ ở root để đối chiếu). README gọi đúng tên “Task Dashboard”.

Phía `client` là React + Vite + TypeScript + Tailwind. `client/package.json` (name `task-dashboard-client`) dùng Zustand, axios, dnd-kit, date-fns và recharts. Trong `client/src` có đủ view List, Board, Calendar, Stats; form/task item; subtasks; tag; theme; toast; hook nhắc hạn `useReminders`. Store nằm ở `client/src/store/useStore.ts`.

Phía `server` là Express + Prisma. `schema.prisma` dùng SQLite khi dev, với model Task, Subtask và Tag (quan hệ nhiều-nhiều TaskTags). Route tách `tasks`, `subtasks`, `tags`, `stats`. Có `prisma/seed.ts`, migration khởi tạo, `render.yaml` và script `scripts/use-postgres.mjs` để lúc build production đổi provider sang PostgreSQL. Client có `vercel.json`.

README liệt kê CRUD task, sửa inline, checklist, tag, kéo thả thứ tự, bốn kiểu xem, reminder bằng notification trình duyệt, undo Ctrl/Cmd+Z, dark mode và lưu DB.

## Vì sao làm project này?

File `todo.html` một trang đủ để demo nhưng khó mở rộng và không có backend. Mình muốn tách client/server, có schema thật, và thử đường deploy Vercel + Render thay vì chỉ mở HTML local.

## Vấn đề hoặc mục tiêu cần giải quyết

Mục tiêu là task sống được sau khi refresh: CRUD, subtask, tag, thứ tự kéo thả, và vài cách nhìn (list/board/calendar/stats). Local dùng SQLite cho nhẹ; host thì SQLite file không hợp nên build production đổi Prisma sang Postgres. Client đọc `VITE_API_URL`, server đọc `DATABASE_URL` và `CLIENT_ORIGIN`. Đây là dashboard học tập, không phải SaaS team.

## Vai trò của tôi trong project

Mình viết lại từ `todo.html` thành hai package, đặt Prisma schema, API route, các view React và file deploy. Repo là việc cá nhân của mình.

## Kết quả và những gì học được

Kết quả là app chạy hai process: server cổng 4000, client cổng 5173. Bài học: giữ `schema.prisma` ở SQLite cho dev rồi chỉ rewrite lúc build thì local không bị vỡ; reminder trình duyệt phụ thuộc quyền notification nên không nên coi là tính năng “luôn chạy”. TypeScript + Prisma giúp mình thấy mismatch sớm hơn file HTML cũ. Repo: https://github.com/human6004/todo-app
