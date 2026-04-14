import React from "react";
import { Search, ShoppingCart, ClipboardList, PackageCheck, MoveRight } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: <Search className="size-8" />,
    title: "Browse Medicines",
    description: "Search and explore our wide range of OTC medicines by category, price, or manufacturer.",
  },
  {
    id: 2,
    icon: <ShoppingCart className="size-8" />,
    title: "Add to Cart",
    description: "Select your medicines, choose the quantity, and add them to your cart.",
  },
  {
    id: 3,
    icon: <ClipboardList className="size-8" />,
    title: "Place Your Order",
    description: "Enter your shipping address and confirm your order with Cash on Delivery.",
  },
  {
    id: 4,
    icon: <PackageCheck className="size-8" />,
    title: "Get Delivered",
    description: "Track your order in real-time and receive your medicines at your doorstep.",
  },
];

const HowItWorks = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="mb-4 text-center text-5xl font-bold">How It Works</h2>
      <p className="mx-auto mb-12 max-w-2xl text-center text-2xl text-muted-foreground">
        Getting your medicines delivered is simple and hassle-free.
      </p>

      {/* Mobile / tablet: stacked grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:hidden">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-28 flex-col items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary/20">
              <span className="mb-1 text-xs font-bold text-primary">
                STEP {step.id}
              </span>
              <div className="text-primary">{step.icon}</div>
            </div>
            <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop: flex row, arrows stretch to fill */}
      <div className="hidden items-start lg:flex">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Card */}
            <div className="flex w-56 shrink-0 flex-col items-center text-center">
              <div className="mb-4 flex size-28 flex-col items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary/20">
                <span className="mb-1 text-xs font-bold text-primary">
                  STEP {step.id}
                </span>
                <div className="text-primary">{step.icon}</div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>

            {/* Arrow between steps — flex-1 makes it stretch to fill */}
            {index < steps.length - 1 && (
              <div className="flex flex-1 items-center justify-center pt-14">
                <div className="relative h-10 w-full">
                  {/* Track line */}
                  <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 rounded-full bg-primary/10" />
                  {/* Sliding arrow */}
                  <div className="animate-arrow-slide absolute inset-0 flex items-center justify-center">
                    <MoveRight
                      className="h-10 w-20 text-primary"
                      strokeWidth={2}
                    />
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
