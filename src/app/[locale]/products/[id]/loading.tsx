import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="aspect-[3/4] w-full rounded-lg" />
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-1/4" />
        <div className="space-y-2 pt-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
        </div>
        <div className="space-y-2 pt-4">
            <Skeleton className="h-6 w-16" />
            <div className="flex gap-2">
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-16" />
            </div>
        </div>
      </div>
    </div>
  );
}
