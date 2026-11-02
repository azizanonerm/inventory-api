import express from "express";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import stockMovementRoutes from "./routes/stock-movement.routes.js";
import { notFoundHandler, errorHandler } from "./middlewares/error-handler.js";

const app = express();

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

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/stock-movements", stockMovementRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;