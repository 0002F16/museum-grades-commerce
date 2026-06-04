"""
Museum Grades — luxury handbag scraper
Source: shop.rebag.com (Shopify JSON API — no browser required)
Note:  Komehyo's English site (en.komehyo.com) no longer resolves (DNS dead).
       Rebag is used for all 120 products; its JSON API returns complete structured data.

Output: scripts/scraped-products.json  (120 products, 20 per brand)
Brands: Chanel, Louis Vuitton, Gucci, Prada, Hermès, Saint Laurent

Condition mapping (Rebag → site grades)
────────────────────────────────────────
  New            → New
  Never Carried  → Pristine
  Pristine       → Pristine
  Excellent      → Excellent
  Great          → Very Good
  Very good      → Very Good
  Good           → Good
  Fair           → Fair
  Outlet         → Good  (discounted outlet pieces)
"""

import ssl
import json
import re
import time
import random
import hashlib
import urllib.request
from pathlib import Path
from html import unescape
from collections import defaultdict

# ── Config ────────────────────────────────────────────────────────────────────

TARGET_PER_BRAND = 20
OUTPUT_PATH = Path(__file__).parent / "scraped-products.json"

BRANDS = [
    ("Chanel",        "chanel"),
    ("Louis Vuitton", "louis-vuitton"),
    ("Gucci",         "gucci"),
    ("Prada",         "prada"),
    ("Hermès",        "hermes"),
    ("Saint Laurent", "saint-laurent"),
]

# Retail multipliers: resale price × multiplier ≈ original retail
RETAIL_MULT = {
    "Chanel":        2.0,
    "Louis Vuitton": 1.7,
    "Gucci":         1.8,
    "Prada":         1.8,
    "Hermès":        2.2,
    "Saint Laurent": 1.8,
}

# Product-type map: Rebag type → site bagType
TYPE_MAP = {
    "clutch": "Clutches",
    "clutches": "Clutches",
    "handbag": "Handbags",
    "handbags": "Handbags",
    "shoulder bag": "Shoulder Bags",
    "shoulder bags": "Shoulder Bags",
    "tote": "Totes",
    "totes": "Totes",
    "backpack": "Backpacks",
    "backpacks": "Backpacks",
    "bucket bag": "Bucket Bags",
    "bucket bags": "Bucket Bags",
    "belt bag": "Belt Bags",
    "belt bags": "Belt Bags",
    "hobo": "Hobo Bags",
    "hobo bags": "Hobo Bags",
    "satchel": "Satchels",
    "satchels": "Satchels",
    "crossbody": "Crossbody Bags",
    "crossbody bags": "Crossbody Bags",
    "mini bag": "Handbags",
    "pouch": "Clutches",
    "wristlet": "Clutches",
    "top handle": "Handbags",
    "top handles": "Handbags",
}

# ── HTTP helper ───────────────────────────────────────────────────────────────

_SSL_CTX = ssl.create_default_context()
_SSL_CTX.check_hostname = False
_SSL_CTX.verify_mode = ssl.CERT_NONE

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)


def fetch_json(url: str, retries: int = 3) -> dict:
    for attempt in range(retries):
        try:
            req = urllib.request.Request(
                url,
                headers={
                    "User-Agent": UA,
                    "Accept": "application/json",
                    "Accept-Language": "en-US,en;q=0.9",
                },
            )
            with urllib.request.urlopen(req, timeout=20, context=_SSL_CTX) as r:
                return json.loads(r.read().decode("utf-8"))
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(random.uniform(2, 4))
                continue
            raise
    return {}


def random_delay(lo: float = 0.5, hi: float = 1.5):
    time.sleep(random.uniform(lo, hi))


# ── Parsing helpers ───────────────────────────────────────────────────────────

def html_field(body_html: str, field: str) -> str:
    """Extract value after <b>Field:</b> in Rebag body_html."""
    m = re.search(
        rf'<b>{re.escape(field)}[:\s]*</b>\s*([^<\n]+)',
        body_html,
        re.IGNORECASE,
    )
    if m:
        return unescape(m.group(1).strip().rstrip("|").strip())
    return ""


def parse_condition_block(body_html: str) -> tuple[str, str, str, str]:
    """
    Rebag body_html:
      <b>Condition:</b> Great.  Exterior: minor scuffs | Interior: clean | Hardware: scratches
    Returns: (grade, exterior_note, interior_note, hardware_note)
    """
    m = re.search(r'<b>Condition:</b>\s*([^<]+)', body_html, re.IGNORECASE)
    raw = unescape(m.group(1).strip()) if m else ""

    # Grade is the first word(s) before the first period or pipe
    grade_match = re.match(r'^([A-Za-z ]+?)(?:\.|  |\s*\|)', raw)
    grade = grade_match.group(1).strip() if grade_match else raw.split(".")[0].strip()

    # Extract condition notes
    ext = re.search(r'Exterior:\s*([^|<\n]+)', raw, re.IGNORECASE)
    inp = re.search(r'Interior:\s*([^|<\n]+)', raw, re.IGNORECASE)
    hdw = re.search(r'Hardware:\s*([^|<\n]+)', raw, re.IGNORECASE)

    exterior = ext.group(1).strip() if ext else "Shows light signs of use"
    interior = inp.group(1).strip() if inp else "Interior clean"
    hardware = hdw.group(1).strip() if hdw else "Hardware shows expected wear"

    return grade, exterior, interior, hardware


def map_condition(grade: str) -> str:
    g = grade.strip().lower()
    if g in ("new",):
        return "New"
    if g in ("never carried",):
        return "Pristine"
    if g in ("pristine",):
        return "Pristine"
    if g in ("excellent",):
        return "Excellent"
    if g in ("great",):
        return "Very Good"
    if g in ("very good",):
        return "Very Good"
    if g in ("good",):
        return "Good"
    if g in ("fair", "outlet"):
        return "Fair"
    return "Good"


def parse_measurements(raw: str) -> dict:
    """
    Rebag format: 'Handle Drop None", Height 3", Width 3.5", Depth 3", Strap Drop 21"'
    """
    result = {"base": "N/A", "height": "N/A", "depth": "N/A", "drop": "N/A"}
    if not raw:
        return result

    def extract(pattern: str) -> str:
        m = re.search(pattern + r'\s*([\d.]+)"', raw, re.IGNORECASE)
        return f'{m.group(1)}"' if m else "N/A"

    result["base"] = extract("Width")
    result["height"] = extract("Height")
    result["depth"] = extract("Depth")
    # Drop: prefer Strap, fall back to Handle
    strap = re.search(r'Strap Drop\s*([\d.]+)"', raw, re.IGNORECASE)
    handle = re.search(r'Handle Drop\s*([\d.]+)"', raw, re.IGNORECASE)
    drop_match = strap or handle
    result["drop"] = f'{drop_match.group(1)}"' if drop_match else "N/A"

    return result


def parse_accessories(raw: str) -> str:
    """Build comesWith string, always prefixed with Museum Grades CoA."""
    base = "Museum Grades Certificate of Authenticity"
    raw = raw.strip()
    if not raw or raw.lower() in ("no accessories", "none", ""):
        return base
    return f"{base}, {raw}"


def map_bag_type(product_type: str) -> str:
    pt = product_type.strip().lower()
    return TYPE_MAP.get(pt, "Handbags")


def make_product_id(handle: str) -> str:
    """Stable ID: 'rb-' + last numeric segment from handle."""
    nums = re.search(r'(\d{6,})$', handle)
    if nums:
        return f"rb-{nums.group(1)}"
    return f"rb-{hashlib.sha1(handle.encode()).hexdigest()[:10]}"


def estimate_retail(brand: str, price: int) -> int:
    mult = RETAIL_MULT.get(brand, 1.8)
    raw = price * mult
    return int(round(raw / 50) * 50)  # round to nearest $50


def build_slug(brand: str, name: str, product_id: str) -> str:
    def slugify(s: str) -> str:
        s = s.lower()
        for src, rep in [("è","e"),("é","e"),("ê","e"),("ë","e"),
                          ("à","a"),("á","a"),("â","a"),("ã","a"),("ä","a"),
                          ("ì","i"),("í","i"),("î","i"),("ï","i"),
                          ("ò","o"),("ó","o"),("ô","o"),("õ","o"),("ö","o"),
                          ("ù","u"),("ú","u"),("û","u"),("ü","u")]:
            s = s.replace(src, rep)
        return re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return f"{slugify(brand)}-{slugify(name[:60])}-{product_id}"


# ── Scraper ───────────────────────────────────────────────────────────────────

def get_bag_handles(collection_slug: str, target: int) -> list[str]:
    """Collect at least `target` handbag product handles from the collection."""
    handles = []
    page = 1
    while len(handles) < target * 3:  # over-fetch for filtering
        url = (
            f"https://shop.rebag.com/collections/{collection_slug}"
            f"/products.json?limit=250&page={page}"
        )
        try:
            data = fetch_json(url)
        except Exception as e:
            print(f"      collection page {page} error: {e}")
            break

        products = data.get("products", [])
        if not products:
            break

        for p in products:
            h = p.get("handle", "")
            if "handbag" in h.lower() or p.get("product_type", "").lower() in TYPE_MAP:
                handles.append(h)

        page += 1
        random_delay(0.3, 0.8)

        if len(products) < 250:
            break  # last page

    return handles


def scrape_product(handle: str, brand: str) -> dict | None:
    url = f"https://shop.rebag.com/products/{handle}.json"
    try:
        data = fetch_json(url)
    except Exception as e:
        print(f"      fetch error {handle}: {e}")
        return None

    p = data.get("product", {})
    if not p:
        return None

    body = p.get("body_html", "")

    # Core fields
    title = p.get("title", "").strip()
    if not title:
        return None

    price_raw = p.get("variants", [{}])[0].get("price", "0")
    price = int(float(price_raw))
    if price == 0:
        return None

    # Condition
    grade, exterior, interior, hardware = parse_condition_block(body)
    condition = map_condition(grade)

    # Other parsed fields
    color_ext = html_field(body, "Exterior Color") or html_field(body, "Color")
    material_ext = html_field(body, "Exterior Material") or html_field(body, "Material")
    accessories_raw = html_field(body, "Accessories")
    measurements_raw = html_field(body, "Measurements")
    item_num = html_field(body, "Item Number") or handle.split("-")[-1]

    # Size
    size = parse_measurements(measurements_raw)

    # Images
    images = [
        img["src"]
        for img in p.get("images", [])[:4]
        if img.get("src", "").startswith("http")
    ]

    # Bag type
    bag_type = map_bag_type(p.get("product_type", ""))

    # Description from body_html → strip tags
    description_raw = re.sub(r"<[^>]+>", " ", body).strip()
    description = re.sub(r"\s{2,}", " ", description_raw)[:900]

    product_id = make_product_id(handle)
    slug = build_slug(brand, title, product_id)
    est_retail = estimate_retail(brand, price)
    savings = round((1 - price / est_retail) * 100) if est_retail > price else 0

    return {
        "id": product_id,
        "slug": slug,
        "brand": brand,
        "name": title,
        "price": price,
        "estRetail": est_retail,
        "savingsPercent": savings,
        "condition": condition,
        "color": color_ext or "Unknown",
        "material": material_ext or "Leather",
        "bagType": bag_type,
        "images": images,
        "description": description,
        "itemNumber": item_num,
        "exterior": exterior,
        "hardware": hardware,
        "interior": interior,
        "comesWith": parse_accessories(accessories_raw),
        "size": size,
        "source": "rebag",
    }


# ── Main ──────────────────────────────────────────────────────────────────────

def run():
    all_products: list[dict] = []
    seen_ids: set[str] = set()

    print(f"Scraping {len(BRANDS)} brands × {TARGET_PER_BRAND} = {len(BRANDS)*TARGET_PER_BRAND} products from Rebag\n")

    for brand_name, collection_slug in BRANDS:
        print(f"[{brand_name}] fetching collection handles …")
        handles = get_bag_handles(collection_slug, TARGET_PER_BRAND)
        print(f"  {len(handles)} bag handles available")

        collected = []
        for handle in handles:
            if len(collected) >= TARGET_PER_BRAND:
                break

            product = scrape_product(handle, brand_name)
            if not product:
                continue
            if product["id"] in seen_ids:
                continue

            seen_ids.add(product["id"])
            collected.append(product)
            print(
                f"  [{len(collected)}/{TARGET_PER_BRAND}] "
                f"${product['price']:,} {product['condition']:10s} {product['name'][:55]}"
            )
            random_delay(0.4, 1.0)

        all_products.extend(collected)
        print(f"  → collected {len(collected)}/{TARGET_PER_BRAND}\n")
        random_delay(1.0, 2.0)

    OUTPUT_PATH.write_text(json.dumps(all_products, indent=2, ensure_ascii=False))
    print(f"✓ Saved {len(all_products)} products → {OUTPUT_PATH}")

    # Summary
    by_brand: dict[str, int] = defaultdict(int)
    by_cond: dict[str, int] = defaultdict(int)
    for p in all_products:
        by_brand[p["brand"]] += 1
        by_cond[p["condition"]] += 1

    print("\nBy brand:")
    for b, n in sorted(by_brand.items()):
        print(f"  {b}: {n}")
    print("\nBy condition:")
    for c, n in sorted(by_cond.items()):
        print(f"  {c}: {n}")


if __name__ == "__main__":
    run()
