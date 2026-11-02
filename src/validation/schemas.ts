import { z } from "zod";

export const productCreateSchema = z.object({
  name: z.string().trim().min(1, "name wajib diisi"),
  sku: z.string().trim().min(1, "sku wajib diisi"),
  stock: z.number().int().min(0).optional().default(0),
  price: z.number().int().min(0).optional().default(0),
  categoryId: z.number().int().positive().nullable().optional(),
});

export const productUpdateSchema = productCreateSchema
  .omit({ stock: true, price: true })
  .extend({
    stock: z.number().int().min(0).optional(),
    price: z.number().int().min(0).optional(),
  })
  .partial();

export const categoryCreateSchema = z.object({
  name: z.string().trim().min(1, "name wajib diisi"),
});

export const stockMovementCreateSchema = z.object({
  productId: z.number().int().positive("productId wajib berupa angka positif"),
  type: z.enum(["IN", "OUT"], "type harus IN atau OUT"),
  quantity: z.number().int().positive("quantity harus bilangan bulat lebih dari 0"),
  note: z.string().trim().min(1).optional(),
});
