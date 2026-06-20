# Product Inventory Update - 2026-06-16

## Summary

Added 300 additional luxury bag listings to `src/lib/seed-data.ts`.

- 50 Chanel bags
- 50 Louis Vuitton bags
- 50 Gucci bags
- 50 Prada bags
- 50 Hermes bags (`Hermès` in the seed data)
- 50 Saint Laurent bags

The website now has 470 seed products total:

- Chanel: 80
- Saint Laurent: 80
- Hermes (`Hermès` in the seed data): 80
- Prada: 80
- Gucci: 80
- Louis Vuitton: 70

## Files Changed

- `src/lib/seed-data.ts` - appended a dated inventory block named `ADDITIONAL SOURCED INVENTORY`.
- `scripts/scrape.py` - updated the Rebag condition mapping comments and function so future scraper output uses the site's existing condition labels.
- `docs/product-inventory-update-2026-06-16.md` - this manager-facing note.

## Sources Used

Primary structured listing data came from Rebag's public Shopify JSON product feed because it includes complete product fields needed by the site: product name, price, condition notes, measurements, accessories, item number, and image URLs.

Komehyo JP was used as the Japanese-market cross-reference for live brand-bag listings and condition/rank normalization. Its official guide defines the Japanese rank meanings used below.

Reference URLs:

- Rebag collections: `https://shop.rebag.com/collections/{brand}/products.json`
- Komehyo Chanel bag list example: `https://komehyo.jp/brandbag/chanel/`
- Komehyo item/rank guide: `https://komehyo.jp/include_html/ec/guide/article/index.html`

## Condition Mapping

The site currently supports only these public condition labels:

- `New`
- `Excellent`
- `Shows Wear`
- `Worn`
- `Fair`

### Rebag To Museum Grades

| Rebag condition | Museum Grades condition | Notes |
| --- | --- | --- |
| New | New | Unused/new condition. |
| Never Carried | New | Treated as unworn inventory. |
| Pristine | New | No separate `Pristine` label exists on the site. |
| Excellent | Excellent | Direct high-condition match. |
| Great | Excellent | Better than normal wear, mapped upward. |
| Very Good | Excellent | Site does not have `Very Good`; current UI groups this with excellent-condition inventory. |
| Good | Shows Wear | Visible use but still sellable. |
| Outlet | Shows Wear | Discounted/outlet items are not automatically poor condition. |
| Fair | Fair | Direct low-condition match. |

### Komehyo JP To Museum Grades

| Komehyo rank | Meaning from Komehyo guide | Museum Grades condition |
| --- | --- | --- |
| 新品 | Brand-new item sourced by Komehyo. | New |
| 未使用品 | Bought from a customer but unused/unworn. | New |
| 中古品S | Used item close to unused. | Excellent |
| 中古品A | Clean used item with little sense of use. | Excellent |
| 中古品B | Used item with signs of use. | Shows Wear |
| 中古品C | Strong signs of use. | Worn |

`Fair` is retained for Rebag's explicit `Fair` condition. Komehyo's public rank ladder does not use `Fair`, so `中古品C` maps to `Worn` instead.

## Manager Notes

The appended products keep the same shape as the existing seed catalogue. Each listing includes:

- stable product ID
- slug
- brand
- bag name
- price and estimated retail
- mapped condition
- color, material, and bag type
- up to four image URLs
- description and condition notes
- accessories
- measurements

To reload this inventory into the database, run the existing seed command after confirming `DATABASE_URL` is set.

Do not add new public condition labels unless the UI, filters, admin form, and `Product` type are updated together. The current condition meter and admin dropdown expect the five labels listed above.

## Future Sourcing Guidance

When adding more products:

1. Keep condition labels in the Museum Grades model.
2. Preserve source item numbers in `itemNumber`.
3. Use source-specific prefixes for IDs when possible, such as `rb-` for Rebag.
4. Skip records without images.
5. Prefer structured feeds or product pages over manually copied listing text.
6. If using Komehyo JP listings, map `中古品A/B/C` before importing so the public filters stay consistent.
