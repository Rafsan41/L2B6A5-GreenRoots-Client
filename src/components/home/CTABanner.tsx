import Link from "next/link";
import { ShoppingBag, UserPlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTABanner = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 md:p-14">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col items-center gap-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-1.5 text-sm font-medium backdrop-blur">
            <Sparkles className="size-4 text-primary" />
            <span>Trusted by thousands nationwide</span>
          </div>

          <h2 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Ready to order your medicines?
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
            Join thousands of happy customers. Fast delivery, genuine products,
            and cash on delivery available across the country.
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="/medicines">
                <ShoppingBag className="size-5" />
                Shop Now
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href="/register">
                <UserPlus className="size-5" />
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
