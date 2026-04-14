import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Testimonial = {
  id: number;
  name: string;
  location: string;
  rating: number;
  review: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rafsan Ahmed",
    location: "Dhaka",
    rating: 5,
    review:
      "Fast delivery and genuine medicines! I ordered late at night and received my prescription within hours. MediStore has become my go-to pharmacy.",
    avatar: "RA",
  },
  {
    id: 2,
    name: "Sarah Rahman",
    location: "Chittagong",
    rating: 5,
    review:
      "Great prices and genuine products. The search and category filters make it so easy to find exactly what I need. Highly recommended!",
    avatar: "SR",
  },
  {
    id: 3,
    name: "Karim Hossain",
    location: "Sylhet",
    rating: 4,
    review:
      "Easy to order and track. The real-time delivery updates give me peace of mind, and the cash on delivery option is very convenient.",
    avatar: "KH",
  },
];

const Testimonials = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="mb-4 text-center text-5xl font-bold">
        What Our Customers Say
      </h2>
      <p className="mx-auto mb-12 max-w-2xl text-center text-2xl text-muted-foreground">
        Trusted by thousands of customers across the country.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <Card
            key={t.id}
            className="relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <CardContent className="flex h-full flex-col gap-4 p-6">
              {/* Decorative quote icon */}
              <Quote className="absolute top-4 right-4 size-10 text-primary/10" />

              {/* Star rating */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < t.rating
                        ? "size-5 fill-yellow-400 text-yellow-400"
                        : "size-5 text-muted-foreground/30"
                    }
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="flex-1 text-base leading-relaxed text-muted-foreground">
                &ldquo;{t.review}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-2 flex items-center gap-3 border-t pt-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
