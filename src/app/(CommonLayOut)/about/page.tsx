import Link from "next/link"
import {
  ShieldCheck, Truck, Clock, HeartPulse, Star, Users, Package,
  Pill, Award, Globe, Phone, Mail, MapPin, ArrowRight,
  CheckCircle2, Sparkles, Target, Lightbulb, Handshake,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// ── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  { value: "50K+",  label: "Happy Customers",    icon: Users },
  { value: "500+",  label: "Medicines Listed",   icon: Pill },
  { value: "99%",   label: "Delivery Success",   icon: Truck },
  { value: "4.9★",  label: "Average Rating",     icon: Star },
]

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & Safety",
    description:
      "Every product on MediStore is sourced from certified manufacturers and licensed pharmacies. We never compromise on quality.",
  },
  {
    icon: HeartPulse,
    title: "Patient First",
    description:
      "We put the health of our customers above everything else. Our team reviews every listing to ensure accuracy and safety.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We continuously improve our platform with the latest technology to make ordering medicines faster, easier, and smarter.",
  },
  {
    icon: Handshake,
    title: "Integrity",
    description:
      "Transparent pricing, honest product information, and no hidden fees. What you see is exactly what you get.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description:
      "We believe quality healthcare should be accessible to everyone, regardless of location or income level.",
  },
  {
    icon: Target,
    title: "Accountability",
    description:
      "We stand behind every order. If something goes wrong, we make it right — no questions asked.",
  },
]

const team = [
  {
    name: "Dr. Aryan Mehta",
    role: "Founder & CEO",
    bio: "20+ years in pharmaceutical logistics. Former head of supply chain at Apollo Pharmacy.",
    initials: "AM",
    color: "from-primary/20 to-primary/5",
  },
  {
    name: "Priya Sharma",
    role: "Chief Medical Officer",
    bio: "MBBS, MD Pharmacology. Ensures every product listing meets clinical safety standards.",
    initials: "PS",
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    name: "Rahul Verma",
    role: "Head of Technology",
    bio: "Full-stack engineer with 10+ years building scalable health-tech platforms.",
    initials: "RV",
    color: "from-orange-400/20 to-orange-400/5",
  },
  {
    name: "Sneha Patel",
    role: "Customer Experience Lead",
    bio: "Dedicated to making every interaction with MediStore smooth, fast, and delightful.",
    initials: "SP",
    color: "from-pink-400/20 to-pink-400/5",
  },
]

const milestones = [
  { year: "2020", event: "MediStore founded with 50 products and a small local team." },
  { year: "2021", event: "Expanded to 200+ medicines. Launched mobile-friendly website." },
  { year: "2022", event: "Reached 10,000 customers. Partnered with 30+ manufacturers." },
  { year: "2023", event: "Launched seller portal. Onboarded 50+ pharmacy partners." },
  { year: "2024", event: "50,000+ customers. Launched prescription management system." },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="w-full">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20 md:py-28">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="container relative mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1.5 text-sm font-medium backdrop-blur">
            <Sparkles className="size-4 text-primary" />
            Our Story
          </div>

          <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Making Healthcare{" "}
            <span className="text-primary">Accessible</span> for Everyone
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            MediStore was born from a simple belief: quality medicines should be
            just a few clicks away — affordable, genuine, and delivered fast to
            your door.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="/medicines">
                <Pill className="size-5" />
                Browse Medicines
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href="/contact">
                <Phone className="size-4" />
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────────────────── */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <p className="text-3xl font-bold tracking-tight">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ─────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* Text */}
          <div className="space-y-6">
            <Badge variant="outline" className="gap-1.5 text-primary border-primary/30">
              <HeartPulse className="size-3.5" />
              Our Mission
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              A pharmacy you can trust, in your pocket
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              MediStore started in 2020 when our founder, Dr. Aryan Mehta, noticed
              how difficult it was for people in smaller cities to access genuine,
              affordable medicines. Long queues, stock-outs, and counterfeit products
              were rampant.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We set out to build a platform that connects verified pharmacies and
              manufacturers directly with patients — cutting out middlemen, ensuring
              authenticity, and making doorstep delivery the norm, not the exception.
            </p>

            <ul className="space-y-3">
              {[
                "100% genuine, licensed products",
                "Same-day delivery in major cities",
                "Prescription management & reminders",
                "24/7 pharmacist support chat",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Timeline */}
          <div className="relative space-y-0 pl-6">
            {/* Vertical line */}
            <div className="absolute left-0 top-2 h-[calc(100%-16px)] w-0.5 bg-gradient-to-b from-primary via-primary/40 to-transparent" />

            {milestones.map(({ year, event }, i) => (
              <div key={year} className="relative pb-8 last:pb-0">
                {/* Dot */}
                <div className="absolute -left-[25px] flex size-[18px] items-center justify-center rounded-full border-2 border-primary bg-background">
                  <div className="size-2 rounded-full bg-primary" />
                </div>
                <div className="ml-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    {year}
                  </span>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Core Values ───────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 gap-1.5 text-primary border-primary/30">
            <Award className="size-3.5" />
            What We Stand For
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Our Core Values
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Everything we do is guided by six principles that put patients and partners first.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── Team ──────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 gap-1.5 text-primary border-primary/30">
            <Users className="size-3.5" />
            The People
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Meet Our Team
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            A passionate group of doctors, engineers, and healthcare professionals
            united by one goal — better health for everyone.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map(({ name, role, bio, initials, color }) => (
            <div
              key={name}
              className="group flex flex-col items-center rounded-2xl border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Avatar */}
              <div
                className={`mb-4 flex size-20 items-center justify-center rounded-full bg-gradient-to-br ${color} text-2xl font-bold text-primary ring-4 ring-primary/10 transition-all group-hover:ring-primary/20`}
              >
                {initials}
              </div>
              <h3 className="font-semibold">{name}</h3>
              <p className="mb-3 text-xs font-medium text-primary">{role}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{bio}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── Why Choose Us ─────────────────────────────────────────────────── */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 gap-1.5 text-primary border-primary/30">
              <Package className="size-3.5" />
              Why MediStore
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              The MediStore Advantage
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "100% Authentic Products",
                desc: "Every medicine is verified with batch numbers and sourced directly from licensed manufacturers.",
                badge: "Verified",
              },
              {
                icon: Truck,
                title: "Fast Doorstep Delivery",
                desc: "Same-day delivery in major cities. Next-day delivery across the country. Real-time tracking.",
                badge: "Same-day",
              },
              {
                icon: Clock,
                title: "24 / 7 Support",
                desc: "Our pharmacists and support team are available round the clock to answer your health queries.",
                badge: "Always on",
              },
            ].map(({ icon: Icon, title, desc, badge }) => (
              <div
                key={title}
                className="relative overflow-hidden rounded-2xl border bg-card p-8"
              >
                <div className="absolute right-4 top-4">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 text-xs">
                    {badge}
                  </Badge>
                </div>
                <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon className="size-7 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact strip ─────────────────────────────────────────────────── */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <h3 className="text-xl font-semibold">Have a question?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Our team is here to help you 7 days a week.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 md:justify-end">
              <a
                href="mailto:support@medistore.app"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="size-4 text-primary" />
                support@medistore.app
              </a>
              <a
                href="tel:+911800000000"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Phone className="size-4 text-primary" />
                1800-000-0000
              </a>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4 text-primary" />
                Ahmedabad, Gujarat, India
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-10 text-center md:p-16">
          <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
              <HeartPulse className="size-8 text-primary" />
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Join the MediStore family today
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
              50,000+ customers already trust us for their daily medicine needs.
              Start shopping and experience the difference.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link href="/medicines">
                  <Pill className="size-4" />
                  Browse Medicines
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
