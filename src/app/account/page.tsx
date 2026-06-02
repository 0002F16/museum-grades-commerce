import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Header } from "@/components/Header";
import { SignOutButton } from "@/components/SignOutButton";

export const metadata = { title: "My Account — Museum Grades" };

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/sign-in");

  const { user } = session;

  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-8 md:px-[42px] md:py-12">
        <div className="max-w-[600px]">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[3px]" style={{ color: "rgba(25,28,31,0.5)" }}>
            My Account
          </p>
          <h1 className="mb-10 text-[32px] font-medium" style={{ color: "rgb(25,28,31)" }}>
            {user.name}
          </h1>

          <div className="mb-10 border-t" style={{ borderColor: "rgb(229,229,229)" }}>
            <dl>
              {[
                { label: "Name", value: user.name },
                { label: "Email", value: user.email },
                { label: "Member since", value: new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-wrap items-baseline justify-between gap-1 border-b py-4" style={{ borderColor: "rgb(229,229,229)" }}>
                  <dt className="text-[12px] font-semibold uppercase tracking-[2px]" style={{ color: "rgba(25,28,31,0.55)" }}>
                    {label}
                  </dt>
                  <dd className="text-[14px] break-all" style={{ color: "rgb(25,28,31)" }}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Orders placeholder */}
          <div className="mb-10">
            <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-[2px]" style={{ color: "rgba(25,28,31,0.55)" }}>
              Order History
            </h2>
            <p className="text-[14px]" style={{ color: "rgba(25,28,31,0.5)" }}>
              No orders yet.{" "}
              <Link href="/collections/all-bags" className="underline" style={{ color: "rgb(25,28,31)" }}>
                Browse the collection →
              </Link>
            </p>
          </div>

          <SignOutButton />
        </div>
      </main>
    </>
  );
}
