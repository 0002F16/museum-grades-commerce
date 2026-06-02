import { cn } from "@/lib/utils";

const CONDITIONS = ["New", "Excellent", "Shows Wear", "Worn", "Fair"] as const;

const SEGMENT_COLORS = [
  "rgb(252,228,236)",
  "rgb(248,200,216)",
  "rgb(240,170,196)",
  "rgb(210,160,180)",
  "rgb(200,195,195)",
];

interface ConditionMeterProps {
  condition: string;
}

export function ConditionMeter({ condition }: ConditionMeterProps) {
  const activeIndex = CONDITIONS.findIndex(
    (c) => c.toLowerCase() === condition.toLowerCase()
  );

  return (
    <div className="w-full">
      {/* Bar with segments */}
      <div className="relative mb-1">
        <div className="flex h-2 w-full overflow-hidden rounded-full">
          {CONDITIONS.map((_, index) => (
            <div
              key={index}
              className={cn(
                "flex-1",
                index > 0 && "ml-[1px]"
              )}
              style={{ backgroundColor: SEGMENT_COLORS[index] }}
            />
          ))}
        </div>

        {/* Active marker triangle */}
        {activeIndex >= 0 && (
          <div
            className="absolute top-[-8px]"
            style={{
              left: `${(activeIndex / CONDITIONS.length) * 100 + 100 / CONDITIONS.length / 2}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div
              className="h-0 w-0"
              style={{
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "8px solid rgb(200,50,120)",
              }}
            />
          </div>
        )}
      </div>

      {/* Labels */}
      <div className="flex w-full">
        {CONDITIONS.map((label, index) => (
          <span
            key={index}
            className={cn(
              "flex-1 text-center text-[10px] leading-tight md:text-[11px]",
              activeIndex === index ? "font-semibold" : "font-normal"
            )}
            style={{
              color:
                activeIndex === index
                  ? "rgb(25,28,31)"
                  : "rgba(25,28,31,0.55)",
            }}
          >
            {/* Abbreviate on mobile */}
            <span className="md:hidden">
              {label === "Shows Wear" ? "Wear" : label === "Excellent" ? "Excl." : label}
            </span>
            <span className="hidden md:inline">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
