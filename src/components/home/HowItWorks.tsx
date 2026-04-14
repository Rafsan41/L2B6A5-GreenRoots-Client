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

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-7">
        {steps.map((step, index) => (
          <div>
            {/* Step Card */}
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

            {/* Arrow between steps (desktop only) */}
            {index < steps.length - 1 && (
              <div className="hidden items-center justify-center lg:flex">
                <MoveRight className="h-22 w-52 text-primary/40" strokeWidth={1.5} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
