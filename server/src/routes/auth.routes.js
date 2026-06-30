import crypto from "node:crypto";
import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authPayload, signAccessToken } from "../utils/tokens.js";

export const authRouter = express.Router();

async function verifyGoogleIdToken(idToken) {
  if (!idToken) {
    throw new Error("Thiếu idToken Google.");
  }

  const googleClientId =
    process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    throw new Error("Chưa cấu hình GOOGLE_CLIENT_ID trên máy chủ.");
  }

  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
  );

  if (!response.ok) {
    throw new Error("Google token không hợp lệ.");
  }

  const payload = await response.json();

  if (payload.aud !== googleClientId) {
    throw new Error("Google token không hợp lệ.");
  }

  if (payload.email_verified !== "true" && payload.email_verified !== true) {
    throw new Error("Email Google chưa được xác thực.");
  }

  return payload;
}

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập tên, email và mật khẩu." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email đã được sử dụng." });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json(authPayload(user));
  }),
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng." });
    }

    if (user.isLocked) {
      return res.status(403).json({ message: "Tài khoản đã bị khóa." });
    }

    res.json(authPayload(user));
  }),
);

authRouter.post(
  "/google",
  asyncHandler(async (req, res) => {
    const { idToken } = req.body;
    const payload = await verifyGoogleIdToken(idToken);

    const email = payload.email?.toLowerCase();
    if (!email) {
      return res.status(400).json({ message: "Google token không có email." });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: payload.name || "Người dùng Google",
        email,
        password: crypto.randomBytes(24).toString("hex"),
        avatar: payload.picture || "",
      });
    }

    if (user.isLocked) {
      return res.status(403).json({ message: "Tài khoản đã bị khóa." });
    }

    res.json(authPayload(user));
  }),
);

authRouter.post("/logout", (_req, res) => {
  res.json({ message: "Đăng xuất thành công." });
});

authRouter.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Thiếu refresh token." });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.isLocked) {
      return res.status(401).json({ message: "Refresh token không hợp lệ." });
    }

    res.json({ accessToken: signAccessToken(user) });
  }),
);

authRouter.get("/profile", protect, (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});

authRouter.put(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const allowed = ["name", "avatar"];

    for (const key of allowed) {
      if (req.body[key] !== undefined) req.user[key] = req.body[key];
    }

    await req.user.save();
    res.json({ user: req.user.toSafeJSON() });
  }),
);

authRouter.post(
  "/change-password",
  protect,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng." });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công." });
  }),
);

authRouter.post("/forgot-password", (_req, res) => {
  res.json({
    message:
      "Đã ghi nhận yêu cầu đặt lại mật khẩu. Hãy cấu hình email provider để gửi link.",
  });
});
