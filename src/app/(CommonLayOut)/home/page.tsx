import React from "react";
import HeroCarousel from "@/components/home/HeroCarousel";
import { FeatureCarousel } from "@/components/home/FeatureCarousel";
import { CategoryCard } from "@/components/home/CategoryCard";
import { MedicineCard } from "@/components/home/MedicineCard";
import HowItWorks from "@/components/home/HowItWorks";


export default function HomePage() {
    return (
        <div className="w-full">
            {/* Hero Carousel Section */}
            <section className="container mx-auto py-6">
                <HeroCarousel />

            </section>
            <section>
                <h1 className="text-2xl font-bold">Services Featured </h1>
                <FeatureCarousel />
            </section>
            <section>
                <h1 className="text-2xl font-bold text-center py-6">Browse by Medicine Categories</h1>
                <CategoryCard />
            </section>
            <section>
                <h1 className="text-2xl font-bold text-center py-6">Featured Medicines</h1>
                <MedicineCard />
            </section>

            {/* How It Works Section */}
            <HowItWorks />
        </div>
    );
}
