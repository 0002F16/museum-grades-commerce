import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "@/app/actions/admin";

export default function NewProductPage() {
  return (
    <ProductForm
      action={createProductAction}
      heading="Add Product"
      submitLabel="Add Product"
    />
  );
}
