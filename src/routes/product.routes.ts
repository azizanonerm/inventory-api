import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// GET /products  (opsional: /products?categoryId=1)
router.get("/", async (req, res) => {
  let categoryId: number | undefined;

  if (req.query.categoryId !== undefined) {
    categoryId = Number(req.query.categoryId);

    if (Number.isNaN(categoryId)) {
      res.status(400).json({ message: "categoryId harus berupa angka" });
      return;
    }
  }

  const products = await prisma.product.findMany({
    where: { categoryId },
    include: { category: true },
    orderBy: { id: "asc" },
  });

  res.json(products);
});

// GET /products/:id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ message: "ID harus berupa angka" });
    return;
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    res.status(404).json({ message: "Produk tidak ditemukan" });
    return;
  }

  res.json(product);
});

// POST /products
router.post("/", async (req, res) => {
  const { name, sku, stock, price, categoryId } = req.body ?? {};

  if (!name || !sku) {
    res.status(400).json({ message: "name dan sku wajib diisi" });
    return;
  }

  const existing = await prisma.product.findUnique({ where: { sku } });

  if (existing) {
    res.status(409).json({ message: "SKU sudah dipakai produk lain" });
    return;
  }

  if (categoryId !== undefined && categoryId !== null) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      res.status(400).json({ message: "Kategori tidak ditemukan" });
      return;
    }
  }

  const product = await prisma.product.create({
    data: {
      name,
      sku,
      stock: stock ?? 0,
      price: price ?? 0,
      categoryId,
    },
    include: { category: true },
  });

  res.status(201).json(product);
});

// PATCH /products/:id
router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ message: "ID harus berupa angka" });
    return;
  }

  const existing = await prisma.product.findUnique({ where: { id } });

  if (!existing) {
    res.status(404).json({ message: "Produk tidak ditemukan" });
    return;
  }

  const { name, sku, stock, price, categoryId } = req.body ?? {};

  if (categoryId !== undefined && categoryId !== null) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      res.status(400).json({ message: "Kategori tidak ditemukan" });
      return;
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: { name, sku, stock, price, categoryId },
    include: { category: true },
  });

  res.json(product);
});

// DELETE /products/:id
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ message: "ID harus berupa angka" });
    return;
  }

  const existing = await prisma.product.findUnique({ where: { id } });

  if (!existing) {
    res.status(404).json({ message: "Produk tidak ditemukan" });
    return;
  }

  await prisma.product.delete({ where: { id } });

  res.status(204).send();
});

export default router;