import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { categoryCreateSchema } from "../validation/schemas.js";
import { validateBody } from "../utils/validate-body.js";

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
  const { name } = validateBody(categoryCreateSchema, req.body ?? {});

  const existing = await prisma.category.findUnique({ where: { name } });

  if (existing) {
    res.status(409).json({ message: "Kategori sudah ada" });
    return;
  }

  const category = await prisma.category.create({ data: { name } });

  res.status(201).json(category);
});

export default router;
