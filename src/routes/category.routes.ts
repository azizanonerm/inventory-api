import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// GET /categories
router.get("/", async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  res.json(categories);
});

// POST /categories
router.post("/", async (req, res) => {
  const { name } = req.body ?? {};

  if (!name) {
    res.status(400).json({ message: "name wajib diisi" });
    return;
  }

  const existing = await prisma.category.findUnique({ where: { name } });

  if (existing) {
    res.status(409).json({ message: "Kategori sudah ada" });
    return;
  }

  const category = await prisma.category.create({ data: { name } });

  res.status(201).json(category);
});

export default router;