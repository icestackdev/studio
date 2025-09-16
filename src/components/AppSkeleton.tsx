
import { Skeleton } from "@/components/ui/skeleton";
import { Circle, Home, LayoutGrid, ShoppingCart, User } from "lucide-react";

export function AppSkeleton() {
  return (
    <div className="relative max-w-lg mx-auto bg-background min-h-screen flex flex-col">
      {/* Skeleton Header */}
      <header className="fixed top-0 left-0 right-0 h-16 z-40 max-w-lg mx-auto bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between h-full px-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>

      {/* Skeleton Main Content */}
      <main className="flex-1 pt-20 pb-20 px-4 space-y-8">
        <Skeleton className="h-64 w-full rounded-lg" />
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20" />
            </div>
            <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                        <Skeleton className="w-24 h-24 rounded-md" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-4/5" />
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-6 w-1/3" />
                        </div>
                        <Skeleton className="h-5 w-5 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
      </main>

      {/* Skeleton Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-t z-40 max-w-lg mx-auto">
        <div className="grid grid-cols-4 h-full">
          {[Home, LayoutGrid, ShoppingCart, User].map((Icon, i) => (
            <div key={i} className="flex flex-col items-center justify-center gap-1">
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-3 w-10" />
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
