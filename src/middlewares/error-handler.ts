import type { ErrorRequestHandler, RequestHandler } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { HttpError } from "../utils/http-error.js";

// Dipanggil kalau tidak ada route yang cocok
export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`,
  });
};

// Dipanggil kalau ada error di mana pun
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // 1. Error yang sengaja kita lempar (throw new HttpError)
  if (err instanceof HttpError) {
    res.status(err.status).json({
      message: err.message,
      details: err.details,
    });
    return;
  }

  // 2. Body JSON rusak (contoh: kurung salah, koma kurang)
  if (err.type === "entity.parse.failed") {
    res.status(400).json({ message: "Format JSON tidak valid" });
    return;
  }

  // 3. Data duplikat di kolom @unique (contoh: SKU kembar)
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    res.status(409).json({ message: "Data dengan nilai tersebut sudah ada" });
    return;
  }

  // Foreign key masih dipakai data lain (contoh: produk punya riwayat stok)
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
    res.status(409).json({ message: "Data masih digunakan oleh data lain" });
    return;
  }

  // 4. Error lain yang tidak terduga
  console.error(err);
  res.status(500).json({ message: "Terjadi kesalahan di server" });
};
