
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="space-y-8">
            <div className="flex justify-end gap-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
            </div>

            {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-7 w-32" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                    <div className="space-y-4">
                        {[...Array(2)].map((_, j) => (
                            <Skeleton key={j} className="h-28 w-full rounded-lg" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
