import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const electronics = await prisma.category.upsert({
    where: { name: "Elektronik" },
    update: {},
    create: { name: "Elektronik" },
  });

  const stationery = await prisma.category.upsert({
    where: { name: "Alat Tulis" },
    update: {},
    create: { name: "Alat Tulis" },
  });

  await prisma.product.upsert({
    where: { sku: "KB-001" },
    update: {},
    create: {
      name: "Keyboard Mechanical",
      sku: "KB-001",
      stock: 10,
      price: 750000,
      categoryId: electronics.id,
    },
  });

  await prisma.product.upsert({
    where: { sku: "NB-001" },
    update: {},
    create: {
      name: "Notebook A5",
      sku: "NB-001",
      stock: 25,
      price: 25000,
      categoryId: stationery.id,
    },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
