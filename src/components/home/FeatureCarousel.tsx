import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export function FeatureCarousel() {
    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="w-full mx-auto"
        >
            <CarouselContent className="-ml-4">
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-[16/9] items-center justify-center p-6">
                                    <span className="text-3xl font-semibold">{index + 1}</span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
