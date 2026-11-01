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

let nextId = 4;

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


app.post("/products", (req, res) => {
    const { name, sku, stock, price } = req.body ?? {};

  if (!name || !sku) {
    res.status(400).json({ message: "name dan sku wajib diisi" });
    return;
  }

  const newProduct: Product = {
    id: nextId,
    name: name,
    sku: sku,
    stock: stock ?? 0,
    price: price ?? 0,
  };

  nextId = nextId + 1;
  products.push(newProduct);

  res.status(201).json(newProduct);
});

export default app;