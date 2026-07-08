import { NextRequest, NextResponse } from "next/server";
import { getProducts, getFacets } from "@/lib/products";
import type { ProductFilters } from "@/types/product";

// Comma-separated multi-select param → string[].
function list(raw: string | null): string[] | undefined {
  if (!raw) return undefined;
  const arr = raw.split(",").map((s) => s.trim()).filter(Boolean);
  return arr.length ? arr : undefined;
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const filters: ProductFilters = {};
  if (sp.get("q")) filters.query = sp.get("q")!;
  filters.brand = list(sp.get("brand"));
  filters.condition = list(sp.get("condition"));
  filters.color = list(sp.get("color"));
  filters.material = list(sp.get("material"));
  filters.bagType = list(sp.get("bagType"));
  if (sp.get("priceMin") || sp.get("priceMax")) {
    filters.priceRanges = [
      {
        min: sp.get("priceMin") ? Number(sp.get("priceMin")) : 0,
        max: sp.get("priceMax") ? Number(sp.get("priceMax")) : undefined,
      },
    ];
  }
  if (sp.get("sort")) filters.sort = sp.get("sort") as ProductFilters["sort"];
  if (sp.get("page")) filters.page = Number(sp.get("page"));
  if (sp.get("pageSize")) filters.pageSize = Number(sp.get("pageSize"));

  const [{ products, total }, facets] = await Promise.all([
    getProducts(filters),
    getFacets(),
  ]);

  return NextResponse.json({ products, total, facets });
}
