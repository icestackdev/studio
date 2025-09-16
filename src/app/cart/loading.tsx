
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-[145px] w-full rounded-lg" />
        ))}
      </div>
      <div className="pt-4 space-y-4">
        <div className="flex justify-between">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-7 w-20" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}
