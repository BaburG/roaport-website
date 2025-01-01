import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export function PostDetailSkeleton() {
  return (
    <Card className="w-full max-w-3xl animate-pulse">
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <Skeleton className="w-full h-full rounded-t-lg" />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-20 w-full" />
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 p-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  )
}
