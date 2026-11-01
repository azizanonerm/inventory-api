import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// GET /products
router.get("/", async (_req, res) => {
  const products = await prisma.product.findMany({
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

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    res.status(404).json({ message: "Produk tidak ditemukan" });
    return;
  }

  res.json(product);
});

// POST /products
router.post("/", async (req, res) => {
  const { name, sku, stock, price } = req.body ?? {};

  if (!name || !sku) {
    res.status(400).json({ message: "name dan sku wajib diisi" });
    return;
  }

  const existing = await prisma.product.findUnique({ where: { sku } });

  if (existing) {
    res.status(409).json({ message: "SKU sudah dipakai produk lain" });
    return;
  }

  const product = await prisma.product.create({
    data: {
      name,
      sku,
      stock: stock ?? 0,
      price: price ?? 0,
    },
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

  const { name, sku, stock, price } = req.body ?? {};

  const product = await prisma.product.update({
    where: { id },
    data: { name, sku, stock, price },
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