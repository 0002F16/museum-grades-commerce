import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ImageGallery } from "@/components/ImageGallery";
import { ProductInfo } from "@/components/ProductInfo";
import { RecommendedProducts } from "@/components/RecommendedProducts";
import { getProductBySlug, getAllProducts } from "@/lib/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "All Bags", href: "/collections/all-bags" },
    { label: product.brand, href: `/collections/all-bags?brand=${encodeURIComponent(product.brand)}` },
    { label: product.name },
  ];

  const allProducts = await getAllProducts();
  const recommended = allProducts.filter((p) => p.id !== product.id).slice(0, 6);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="px-4 md:px-[42px]">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Product detail */}
        <div className="md:flex md:flex-row md:items-start md:px-[42px] md:pb-12">
          {/* Image gallery — edge-to-edge on mobile, 55% on desktop */}
          <div className="w-full md:w-[55%]">
            <ImageGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Product info — padded on mobile, side panel on desktop */}
          <div className="w-full px-4 pb-10 pt-6 md:w-[45%] md:px-0 md:pb-0 md:pt-0 md:pl-[50px]">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Recommended products */}
        <div className="px-4 md:px-[42px] pb-12">
          <RecommendedProducts
            products={recommended}
            title="You May Also Like"
          />
        </div>
      </main>
    </>
  );
}
