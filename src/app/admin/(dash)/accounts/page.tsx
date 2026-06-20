import { listUsers } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

function fmtDate(d: Date): string {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminAccountsPage() {
  const users = await listUsers();

  return (
    <div>
      <h1 className="mb-8 text-[24px] font-medium" style={{ color: "rgb(25,28,31)" }}>
        Accounts{" "}
        <span className="text-[15px]" style={{ color: "rgba(25,28,31,0.45)" }}>
          ({users.length})
        </span>
      </h1>

      <div className="border bg-white" style={{ borderColor: "rgb(229,229,229)" }}>
        <div
          className="hidden border-b px-4 py-3 text-[10px] font-semibold uppercase tracking-[1.5px] md:grid md:grid-cols-[1fr_1fr_120px_140px] md:gap-4"
          style={{ borderColor: "rgb(229,229,229)", color: "rgba(25,28,31,0.5)" }}
        >
          <span>Name</span>
          <span>Email</span>
          <span>Status</span>
          <span>Joined</span>
        </div>

        {users.length === 0 && (
          <p className="px-4 py-10 text-center text-[14px]" style={{ color: "rgba(25,28,31,0.5)" }}>
            No accounts yet.
          </p>
        )}

        {users.map((u) => (
          <div
            key={u.id}
            className="grid grid-cols-1 gap-1 border-b px-4 py-3 last:border-b-0 md:grid-cols-[1fr_1fr_120px_140px] md:items-center md:gap-4"
            style={{ borderColor: "rgb(229,229,229)" }}
          >
            <span className="text-[14px] font-medium" style={{ color: "rgb(25,28,31)" }}>
              {u.name}
            </span>
            <span className="text-[14px]" style={{ color: "rgba(25,28,31,0.7)" }}>
              {u.email}
            </span>
            <span className="text-[12px]" style={{ color: u.emailVerified ? "rgb(0,128,0)" : "rgba(25,28,31,0.45)" }}>
              {u.emailVerified ? "Verified" : "Unverified"}
            </span>
            <span className="text-[13px]" style={{ color: "rgba(25,28,31,0.6)" }}>
              {fmtDate(u.createdAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
