import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex flex-wrap items-center gap-1 py-2")}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-1">
            {index > 0 && (
              <span
                className="text-[13px] md:text-[16px]"
                style={{ color: "rgba(25,28,31,0.75)" }}
              >
                /
              </span>
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-[13px] hover:underline md:text-[16px]"
                style={{ color: "rgba(25,28,31,0.75)" }}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-[13px] md:text-[16px]"
                style={{ color: "rgba(25,28,31,0.75)" }}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
