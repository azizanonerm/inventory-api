import assert from "node:assert/strict";
import test from "node:test";
import {
  categoryCreateSchema,
  productCreateSchema,
  stockMovementCreateSchema,
} from "./schemas.js";

test("product schema accepts a valid product", () => {
  const result = productCreateSchema.safeParse({
    name: " Keyboard ",
    sku: " KB-001 ",
    stock: 10,
    price: 750000,
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.name, "Keyboard");
    assert.equal(result.data.stock, 10);
  }
});

test("product schema rejects negative stock and price", () => {
  const result = productCreateSchema.safeParse({
    name: "Keyboard",
    sku: "KB-001",
    stock: -1,
    price: -100,
  });

  assert.equal(result.success, false);
});

test("stock movement schema only accepts positive quantities and valid types", () => {
  assert.equal(
    stockMovementCreateSchema.safeParse({ productId: 1, type: "IN", quantity: 5 }).success,
    true,
  );
  assert.equal(
    stockMovementCreateSchema.safeParse({ productId: 1, type: "OUT", quantity: 0 }).success,
    false,
  );
});

test("category schema rejects blank names", () => {
  assert.equal(categoryCreateSchema.safeParse({ name: "   " }).success, false);
});
