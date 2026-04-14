import React from "react";
import HeroCarousel from "@/components/home/HeroCarousel";
import { FeatureCarousel } from "@/components/home/FeatureCarousel";
import { CategoryCard } from "@/components/home/CategoryCard";
import { MedicineCard } from "@/components/home/MedicineCard";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";


export default function HomePage() {
    return (
        <div className="w-full">
            {/* Hero Carousel Section */}
            <div className="container mx-auto px-4 py-6">
                <HeroCarousel />
            </div>

            {/* Services Featured Section */}
            <div className="container mx-auto px-4 py-10">
                <h1 className="mb-6 text-center text-3xl font-bold">Services Featured</h1>
                <FeatureCarousel />
            </div>

            {/* Categories Section */}
            <div className="container mx-auto px-4 py-10">
                <h1 className="mb-6 text-center text-3xl font-bold">Browse by Medicine Categories</h1>
                <CategoryCard />
            </div>

            {/* Featured Medicines Section */}
            <div className="container mx-auto px-4 py-10">
                <h1 className="mb-6 text-center text-3xl font-bold">Featured Medicines</h1>
                <MedicineCard />
            </div>

            {/* How It Works Section */}
            <HowItWorks />

            {/* Customer Testimonials Section */}
            <Testimonials />

            {/* CTA Banner Section */}
            <CTABanner />
        </div>
    );
}
