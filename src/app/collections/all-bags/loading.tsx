import { Header } from "@/components/Header";

export default function Loading() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="px-4 md:px-[42px] pt-8 pb-2">
          <div className="h-6 w-32 animate-pulse rounded" style={{ backgroundColor: "rgb(238,238,238)" }} />
        </div>

        {/* Category carousel skeleton */}
        <div className="flex gap-2 px-4 md:px-[42px] pb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex w-[120px] flex-shrink-0 flex-col gap-2">
              <div className="h-[110px] w-full animate-pulse md:h-[150px]" style={{ backgroundColor: "rgb(245,245,245)" }} />
              <div className="mx-auto h-3 w-16 animate-pulse rounded" style={{ backgroundColor: "rgb(238,238,238)" }} />
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row px-4 md:px-[42px] pb-12 gap-4 md:gap-8">
          {/* Sidebar skeleton */}
          <div className="hidden md:block w-[280px] min-w-[280px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-t py-4" style={{ borderColor: "rgba(25,28,31,0.15)" }}>
                <div className="h-4 w-24 animate-pulse rounded" style={{ backgroundColor: "rgb(238,238,238)" }} />
              </div>
            ))}
          </div>

          {/* Product grid skeleton */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:gap-x-8 md:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="aspect-square w-full animate-pulse" style={{ backgroundColor: "rgb(245,245,245)" }} />
                  <div className="mx-auto h-3 w-20 animate-pulse rounded" style={{ backgroundColor: "rgb(238,238,238)" }} />
                  <div className="mx-auto h-3 w-28 animate-pulse rounded" style={{ backgroundColor: "rgb(238,238,238)" }} />
                  <div className="mx-auto h-4 w-16 animate-pulse rounded" style={{ backgroundColor: "rgb(238,238,238)" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
