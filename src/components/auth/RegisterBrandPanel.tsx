import {
  BadgeCheck, PackageCheck, Truck,
  HeadphonesIcon, Users, TrendingUp,
} from "lucide-react"

export default function RegisterBrandPanel() {
  return (
    <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 p-12 lg:flex">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 size-72 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute left-24 bottom-32 size-48 rounded-full bg-white/5" />

      {/* Heading */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20">
          <BadgeCheck className="size-3.5" />
          Trusted by 50,000+ customers
        </div>
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-white">
          Why join MediStore?
        </h2>
        <p className="mx-auto max-w-xs text-sm leading-relaxed text-white/70">
          Bangladesh&apos;s most trusted online pharmacy — fast, genuine, and always available.
        </p>
      </div>

      {/* Benefit cards */}
      <div className="mb-8 grid w-full max-w-xs grid-cols-1 gap-3">
        {[
          {
            icon: PackageCheck,
            title: "Genuine medicines",
            desc: "Every product verified by licensed pharmacists",
          },
          {
            icon: Truck,
            title: "Fast delivery",
            desc: "Same-day in Dhaka, 2–3 days nationwide",
          },
          {
            icon: HeadphonesIcon,
            title: "Expert support",
            desc: "24/7 pharmacist chat & prescription help",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex items-start gap-3 rounded-xl bg-white/10 p-3.5 ring-1 ring-white/10 backdrop-blur-sm"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <Icon className="size-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="text-xs leading-snug text-white/65">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Seller callout */}
      <div className="w-full max-w-xs rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
          Are you a pharmacy or seller?
        </p>
        <div className="space-y-2">
          {[
            { icon: Users, text: "Access 50K+ active customers" },
            { icon: TrendingUp, text: "Grow your sales with analytics" },
            { icon: PackageCheck, text: "Easy inventory management" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-white/80">
              <Icon className="size-3.5 shrink-0 text-white/50" />
              {text}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-white/50">
          Select{" "}
          <strong className="text-white/70">Seller / Pharmacy</strong>{" "}
          when registering.
        </p>
      </div>
    </div>
  )
}
