import { Pill, ShieldCheck, Truck, Clock, Star } from "lucide-react"

export default function LoginBrandPanel() {
  return (
    <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 p-12 lg:flex">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute right-24 bottom-32 size-48 rounded-full bg-white/5" />

      {/* Medicine icon */}
      <div className="relative mb-8">
        <div className="flex size-24 items-center justify-center rounded-3xl bg-white/15 shadow-2xl backdrop-blur-sm ring-1 ring-white/20">
          <Pill className="size-12 text-white" strokeWidth={1.5} />
        </div>
        <span className="absolute -right-3 -top-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-primary shadow-lg">
          <Star className="size-3 fill-primary text-primary" />
          4.9
        </span>
      </div>

      {/* Tagline */}
      <div className="mb-8 text-center">
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-white">
          Your health,<br />our priority.
        </h2>
        <p className="mx-auto max-w-xs text-sm leading-relaxed text-white/70">
          Genuine medicines, fast delivery, expert pharmacist support — all in one place.
        </p>
      </div>

      {/* Benefits list */}
      <div className="mb-8 w-full max-w-xs space-y-3">
        {[
          { icon: ShieldCheck, text: "100% genuine, verified medicines" },
          { icon: Truck,       text: "Same-day delivery in Dhaka" },
          { icon: Clock,       text: "24/7 pharmacist support" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15">
              <Icon className="size-4 text-white" />
            </div>
            <span className="text-sm text-white/85">{text}</span>
          </div>
        ))}
      </div>

      {/* Stats strip */}
      <div className="grid w-full max-w-xs grid-cols-3 overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/10">
        {[
          { value: "50K+", label: "Customers" },
          { value: "500+", label: "Medicines" },
          { value: "99%",  label: "Genuine" },
        ].map(({ value, label }) => (
          <div key={label} className="py-3 text-center text-white">
            <p className="text-xl font-black">{value}</p>
            <p className="text-xs text-white/60">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
