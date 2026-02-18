import type { Category } from "../types/models";

export function sumCategories(categories: Category[]): number {
  return categories.reduce(
    (acc, c) => acc + c.items.reduce((a, it) => a + (Number(it.amount) || 0), 0),
    0
  );
}

export function sumByCategory(categories: Category[]) {
  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    total: c.items.reduce((a, it) => a + (Number(it.amount) || 0), 0),
  }));
}
