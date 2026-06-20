"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  checkCredentials,
  setAdminCookie,
  clearAdminCookie,
  verifyAdmin,
} from "@/lib/admin-auth";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/admin-data";

export type ActionState = { error?: string } | undefined;

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function adminLogin(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!checkCredentials(username, password)) {
    return { error: "Invalid username or password." };
  }
  await setAdminCookie();
  redirect("/admin");
}

export async function adminLogout(): Promise<void> {
  await clearAdminCookie();
  redirect("/admin/login");
}

// ─── Products ───────────────────────────────────────────────────────────────

function revalidateStorefront() {
  revalidatePath("/admin/products");
  revalidatePath("/collections/all-bags");
  revalidatePath("/");
}

export async function createProductAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await verifyAdmin())) return { error: "Unauthorized." };
  try {
    await createProduct(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to add product." };
  }
  revalidateStorefront();
  redirect("/admin/products");
}

export async function updateProductAction(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await verifyAdmin())) return { error: "Unauthorized." };
  try {
    await updateProduct(id, formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to save product." };
  }
  revalidateStorefront();
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  if (!(await verifyAdmin())) return;
  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteProduct(id);
    revalidateStorefront();
  }
}
