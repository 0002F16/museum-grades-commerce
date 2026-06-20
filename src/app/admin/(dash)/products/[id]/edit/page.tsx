import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductForEdit } from "@/lib/admin-data";
import { updateProductAction } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductForEdit(id);
  if (!product) notFound();

  // Bind the product id so the form action matches (prev, formData) => state.
  const action = updateProductAction.bind(null, id);

  return (
    <ProductForm
      action={action}
      heading="Edit Product"
      submitLabel="Save Changes"
      initial={{
        brand: product.brand,
        category: product.category,
        name: product.name,
        price: product.price,
        estRetail: product.estRetail,
        condition: product.condition,
        color: product.color,
        material: product.material,
        description: product.description,
        imageUrls: product.imageUrls,
      }}
    />
  );
}
