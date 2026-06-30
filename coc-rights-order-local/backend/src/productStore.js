import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.resolve(__dirname, '../data/products.json');

export async function listProducts() {
  const raw = await fs.readFile(productsPath, 'utf8');
  return JSON.parse(raw);
}

export async function findProduct(input) {
  const value = String(input || '').trim();
  const products = await listProducts();
  return products.find((item) => item.code === value || item.skuId === value) || null;
}
