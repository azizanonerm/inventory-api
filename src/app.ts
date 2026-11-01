import express from "express";

const app = express();

type Product = {
  id: number;
  name: string;
  sku: string;
  stock: number;
  price: number;
};

let products: Product[] = [
  { id: 1, name: "Kardus Besar", sku: "BOX-L-001", stock: 120, price: 8500 },
  { id: 2, name: "Lakban Coklat", sku: "TAPE-BR-001", stock: 45, price: 12000 },
  { id: 3, name: "Bubble Wrap 1m", sku: "BW-1M-001", stock: 8, price: 15000 },
];

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to Inventory API",
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.get("/products", (_req, res) => {
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    res.status(404).json({ message: "Produk tidak ditemukan" });
    return;
  }

  res.json(product);
});

export default app;