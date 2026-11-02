import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { stockMovementCreateSchema } from "../validation/schemas.js";
import { validateBody } from "../utils/validate-body.js";

const router = Router();

// GET /stock-movements  (opsional: ?productId=1)
router.get("/", async (req, res) => {
  let productId: number | undefined;

  if (req.query.productId !== undefined) {
    productId = Number(req.query.productId);

    if (Number.isNaN(productId)) {
      res.status(400).json({ message: "productId harus berupa angka" });
      return;
    }
  }

  const movements = await prisma.stockMovement.findMany({
    where: { productId },
    include: {
      product: { select: { id: true, name: true, sku: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(movements);
});

// POST /stock-movements
router.post("/", async (req, res) => {
  const { productId, type, quantity, note } = validateBody(
    stockMovementCreateSchema,
    req.body ?? {},
  );

  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    res.status(404).json({ message: "Produk tidak ditemukan" });
    return;
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      if (type === "IN") {
        await tx.product.update({
          where: { id: productId },
          data: { stock: { increment: quantity } },
        });
      } else {
        const updated = await tx.product.updateMany({
          where: { id: productId, stock: { gte: quantity } },
          data: { stock: { decrement: quantity } },
        });

        if (updated.count === 0) {
          throw new Error("INSUFFICIENT_STOCK");
        }
      }

      const movement = await tx.stockMovement.create({
        data: { productId, type, quantity, note },
      });

      const latestProduct = await tx.product.findUnique({
        where: { id: productId },
      });

      return { movement, product: latestProduct };
    });

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "INSUFFICIENT_STOCK") {
      res.status(400).json({
        message: `Stok tidak cukup. Stok saat ini: ${product.stock}`,
      });
      return;
    }

    throw error;
  }
});

export default router;
