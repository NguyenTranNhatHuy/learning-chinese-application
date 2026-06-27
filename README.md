# Learning Chinese

Website học tiếng Trung mỗi ngày theo flow trong tài liệu: học từ vựng theo chủ đề/HSK, flashcard, quiz, dashboard, favorite, lịch sử học, hồ sơ và admin CRUD.

## Công nghệ

- Client: React, React Router, Axios, React Query, TailwindCSS, Recharts, Lucide icons
- Server: NodeJS, ExpressJS, JWT, bcryptjs, Multer, Mongoose
- Database: MongoDB

## Chạy project

```bash
npm install
npm run dev
```

Client chạy tại `http://localhost:5173`, server chạy tại `http://localhost:5000`.

## Cấu hình backend

```bash
cp server/.env.example server/.env
npm run seed
```

Sửa `server/.env` nếu MongoDB không chạy ở `mongodb://127.0.0.1:27017/learning-chinese`.

## Tài khoản seed

- Admin: `admin@learningchinese.dev` / `Admin123!`
- User: `user@learningchinese.dev` / `User123!`

Frontend có dữ liệu mẫu và đăng nhập demo để vẫn xem được giao diện khi chưa bật backend.

