"use client";

import React, { useCallback, useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    subtitle:
      "Get quality OTC medicines delivered right to your doorstep. Fast, safe, and affordable.",
    cta: "Shop Now",
    ctaLink: "/medicines",
    bg: "bg-gradient-to-br from-emerald-600 to-teal-700",
    img: "https://i.ibb.co.com/FFCw0h1/pharmacy-online-store-banner.png",
    align: "left",
  },
  {
    id: 2,
    subtitle:
      "Enjoy free shipping on all orders above $50. No hidden charges, just great value.",
    cta: "Browse Medicines",
    ctaLink: "/medicines",
    bg: "bg-gradient-to-br from-blue-600 to-indigo-700",
    img: "https://i.ibb.co.com/TMjrj5xX/pharmacy-online-store-banner3.png",
    align: "right",
  },
  {
    id: 3,
    subtitle:
      "Pay when you receive your order. No online payment hassle. Simple and convenient.",
    cta: "Order Now",
    ctaLink: "/medicines",
    bg: "bg-gradient-to-br from-purple-600 to-violet-700",
    img: "https://i.ibb.co.com/vFJT4Rd/pharmacy-online-store-banner2.png",
    align: "left",
  },
];

const HeroCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <section className="w-full">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0">
              <div
                className={cn(
                  "relative overflow-hidden rounded-xl",
                  "min-h-[350px] md:min-h-[450px] lg:min-h-[550px]",
                  slide.bg
                )}
              >
                {/* Background Image */}
                <img
                  src={slide.img}
                  alt={slide.subtitle}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Content */}
                <div
                  className={cn(
                    "relative z-10 flex flex-col justify-center",
                    "mr-auto max-w-xl items-start text-left",
                    "px-8 py-24 md:px-16 md:py-32 lg:py-72 lg:pl-10 xl:pl-20"
                  )}
                >
                  <p className="mb-8 max-w-xl font-serif text-4xl font-medium leading-relaxed text-white">
                    {slide.subtitle}
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="h-14 bg-white px-8 py-4 text-2xl text-gray-900 hover:bg-white/90"
                  >
                    <a href={slide.ctaLink}>
                      {slide.cta}
                      <ArrowRight className="ml-2 size-5" />
                    </a>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="left-6 size-10 border-white/30 bg-white/20 text-white hover:bg-white/40 md:left-8" />
        <CarouselNext className="right-6 size-10 border-white/30 bg-white/20 text-white hover:bg-white/40 md:right-8" />

        {/* Dot Indicators */}
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                index === current
                  ? "w-8 bg-primary"
                  : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
};

export default HeroCarousel;
