"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion"
import { Star, ShieldCheck, AlertTriangle, PenLine, CheckCircle, Loader2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { Medicine } from "@/types/medicine"
import { authClient, AUTH_BASE_URL } from "@/lib/auth-client"

// ── Types ─────────────────────────────────────────────────
interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  customer: { id: string; name: string; image: string | null }
}

interface DetailTabsProps {
  medicine: Medicine
}

// ── Star picker ───────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`size-7 ${
              s <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  )
}

const DetailTabs = ({ medicine }: DetailTabsProps) => {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const isLoggedIn = !!session?.user

  // ── Reviews state ─────────────────────────────────────
  const [reviews, setReviews]           = useState<Review[]>([])
  const [reviewsLoading, setRLoading]   = useState(true)
  const [visibleReviews, setVisible]    = useState(4)

  // ── Form state ────────────────────────────────────────
  const [showForm, setShowForm]   = useState(false)
  const [rating, setRating]       = useState(0)
  const [comment, setComment]     = useState("")
  const [submitting, setSubmitting] = useState(false)

  // ── Fetch reviews ─────────────────────────────────────
  useEffect(() => {
    fetch(`${AUTH_BASE_URL}/api/medicines/${medicine.id}/reviews`)
      .then((r) => r.json())
      .then((j) => setReviews(j.data ?? []))
      .catch(() => {})
      .finally(() => setRLoading(false))
  }, [medicine.id])

  // ── Computed rating distribution ──────────────────────
  const ratingDist = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length
    const pct   = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
    return { stars, pct }
  })

  const avgRating    = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : medicine.rating
  const reviewCount  = reviews.length || medicine.reviewCount

  // ── Write review ──────────────────────────────────────
  const userRole = (session?.user as any)?.role as string | undefined

  const handleWriteReview = () => {
    if (!isLoggedIn) {
      toast.error("Please log in to write a review", {
        action: { label: "Log In", onClick: () => router.push("/login") },
      })
      return
    }
    if (userRole && userRole.toUpperCase() !== "CUSTOMER") {
      toast.error("Only customers can write reviews.")
      return
    }
    setShowForm(true)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) { toast.error("Please select a star rating."); return }
    setSubmitting(true)
    try {
      const res = await fetch(`${AUTH_BASE_URL}/api/medicines/${medicine.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating, comment: comment.trim() || undefined }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message ?? "Failed to submit review")
      setReviews((prev) => [json.data, ...prev])
      setShowForm(false)
      setRating(0)
      setComment("")
      toast.success("Review submitted! Thank you.")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="container mx-auto px-4 pb-14">
      <Tabs defaultValue="description">
        {/* Tab triggers */}
        <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0 gap-0">
          {[
            { value: "description", label: "Description" },
            { value: "dosage", label: "Dosage & Usage" },
            { value: "reviews", label: `Reviews (${medicine.reviewCount})` },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent px-5 py-3 text-sm font-medium text-muted-foreground transition-colors data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── Description ──────────────────────────────── */}
        <TabsContent value="description" className="mt-6">
          <div className="max-w-3xl space-y-6">
            {/* About */}
            <div>
              <h3 className="mb-2 text-base font-semibold">About this medicine</h3>
              <p className="leading-relaxed text-muted-foreground">{medicine.description}</p>
            </div>

            {/* Uses */}
            {medicine.uses.length > 0 && (
              <div>
                <h3 className="mb-3 text-base font-semibold">What it treats</h3>
                <div className="flex flex-wrap gap-2">
                  {medicine.uses.map((use) => (
                    <span
                      key={use}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                    >
                      <CheckCircle className="size-3.5" />
                      {use}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients */}
            {medicine.ingredients && (
              <div className="rounded-xl border bg-card p-4">
                <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Active Ingredients
                </h3>
                <p className="text-sm text-foreground">{medicine.ingredients}</p>
              </div>
            )}

            {/* Product specs grid */}
            <div className="grid grid-cols-2 gap-3 rounded-xl border bg-card p-4 sm:grid-cols-3">
              {[
                { label: "Manufacturer", value: medicine.manufacturer },
                { label: "Form", value: medicine.form ?? "N/A" },
                { label: "Prescription", value: medicine.prescriptionRequired ? "Required" : "Not required" },
                { label: "Stock", value: `${medicine.stock} units` },
                { label: "Category", value: medicine.category.name },
                { label: "Status", value: medicine.isActive ? "Available" : "Unavailable" },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
                  <span className="text-sm font-semibold capitalize text-foreground">{value}</span>
                </div>
              ))}
            </div>

            {/* Expandable accordion sections */}
            <Accordion type="multiple" className="space-y-2">
              {medicine.sideEffects.length > 0 && (
                <AccordionItem value="side-effects" className="rounded-xl border bg-card px-4">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    Side Effects
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-1.5 pb-2">
                      {medicine.sideEffects.map((effect) => (
                        <li key={effect} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="size-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
                          {effect}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Stop use and consult a doctor if you experience any severe reactions.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              )}

              {medicine.storage && (
                <AccordionItem value="storage" className="rounded-xl border bg-card px-4">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    Storage Instructions
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="pb-2 text-sm text-muted-foreground">{medicine.storage}</p>
                  </AccordionContent>
                </AccordionItem>
              )}

              <AccordionItem value="warnings" className="rounded-xl border border-destructive/20 bg-destructive/5 px-4">
                <AccordionTrigger className="gap-2 text-sm font-semibold text-destructive hover:no-underline">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="size-4" />
                    Warnings &amp; Contraindications
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1.5 pb-2 text-sm text-muted-foreground">
                    {[
                      "Do not exceed the recommended dose",
                      "Keep out of reach of children",
                      "Not recommended during pregnancy without doctor's advice",
                      "Avoid alcohol while taking this medicine",
                      "Consult your doctor if you have liver or kidney problems",
                      ...(medicine.prescriptionRequired
                        ? ["Prescription required — verify with your pharmacist"]
                        : []),
                    ].map((w) => (
                      <li key={w} className="flex items-start gap-2">
                        <span className="mt-1.5 size-1.5 rounded-full bg-destructive/60 shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>

        {/* ── Dosage ───────────────────────────────────── */}
        <TabsContent value="dosage" className="mt-6">
          <div className="max-w-2xl space-y-5">
            {(medicine.dosageAdults || medicine.dosageChildren || medicine.dosageMaxDaily) ? (
              <div className="overflow-hidden rounded-xl border bg-card">
                <div className="border-b bg-primary/5 px-5 py-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="size-4 text-primary" />
                    Dosage Guide
                  </h3>
                </div>
                <div className="divide-y">
                  {[
                    { label: "Adults",       value: medicine.dosageAdults },
                    { label: "Children",     value: medicine.dosageChildren },
                    { label: "Maximum Daily",value: medicine.dosageMaxDaily },
                  ]
                    .filter((row) => row.value)
                    .map(({ label, value }) => (
                      <div key={label} className="flex gap-4 px-5 py-3.5">
                        <span className="w-28 shrink-0 text-sm font-semibold text-foreground">{label}</span>
                        <span className="text-sm text-muted-foreground">{value}</span>
                      </div>
                    ))}
                </div>
                {medicine.dosageNotes && (
                  <div className="border-t bg-muted/30 px-5 py-3 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Note: </span>
                    {medicine.dosageNotes}
                  </div>
                )}
              </div>
            ) : medicine.dosage ? (
              <div className="flex gap-3 rounded-xl border bg-card p-4">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold">Recommended Dosage</p>
                  <p className="mt-1 text-sm text-muted-foreground">{medicine.dosage}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No dosage information available. Please consult your pharmacist or doctor.
              </p>
            )}

            {/* Storage */}
            {medicine.storage && (
              <div className="rounded-xl border bg-card p-4">
                <h4 className="mb-1 text-sm font-semibold">Storage</h4>
                <p className="text-sm text-muted-foreground">{medicine.storage}</p>
              </div>
            )}

            {/* Warning block */}
            <div className="flex gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-destructive">Important Warnings</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Do not exceed the recommended dose</li>
                  <li>• Keep out of reach of children</li>
                  <li>• Store below 25°C away from direct sunlight</li>
                  {medicine.prescriptionRequired && (
                    <li>• A valid prescription is required for this medicine</li>
                  )}
                  <li>• Consult your doctor if symptoms persist beyond 3 days</li>
                  <li>• Avoid taking with alcohol or other sedatives</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Reviews ──────────────────────────────────── */}
        <TabsContent value="reviews" className="mt-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Rating overview */}
            <div className="flex flex-col gap-5 rounded-xl border bg-card p-6">
              <div className="text-center">
                <p className="text-6xl font-black text-primary">{avgRating.toFixed(1)}</p>
                <div className="mt-2 flex items-center justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`size-4 ${
                      i < Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                    }`} />
                  ))}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{reviewCount} reviews</p>
              </div>
              <Separator />
              <div className="space-y-2">
                {ratingDist.map(({ stars, pct }) => (
                  <div key={stars} className="flex items-center gap-2 text-xs">
                    <span className="w-4 text-right text-muted-foreground">{stars}</span>
                    <Star className="size-3 fill-yellow-400 text-yellow-400" />
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary/70 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-7 text-muted-foreground">{pct}%</span>
                  </div>
                ))}
              </div>
              <Separator />
              <Button onClick={handleWriteReview} className="w-full gap-2" variant="outline">
                <PenLine className="size-4" />
                Write a Review
              </Button>
            </div>

            {/* Review list */}
            <div className="flex flex-col gap-4 lg:col-span-2">

              {/* Inline review form */}
              {showForm && (
                <div className="rounded-xl border bg-card p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold">Write your review</p>
                    <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="size-4" />
                    </button>
                  </div>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground">Your rating *</p>
                      <StarPicker value={rating} onChange={setRating} />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground">Comment (optional)</p>
                      <Textarea
                        placeholder="Share your experience with this medicine…"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        className="resize-none text-sm"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" size="sm" disabled={submitting || rating === 0} className="gap-1.5">
                        {submitting && <Loader2 className="size-3.5 animate-spin" />}
                        Submit Review
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Reviews */}
              {reviewsLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="size-6 animate-spin text-primary" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-muted/20 p-10 text-center">
                  <PenLine className="size-8 text-muted-foreground/40" />
                  <div>
                    <p className="text-sm font-semibold">No reviews yet</p>
                    <p className="text-xs text-muted-foreground">Be the first to review this medicine</p>
                  </div>
                  {!showForm && (
                    <Button size="sm" variant="outline" onClick={handleWriteReview} className="gap-2 mt-1">
                      <PenLine className="size-3.5" />Write a Review
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  {reviews.slice(0, visibleReviews).map((review) => (
                    <div key={review.id} className="rounded-xl border bg-card p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {review.customer.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{review.customer.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`size-3.5 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                            }`} />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
                      )}
                    </div>
                  ))}

                  {visibleReviews < reviews.length && (
                    <Button variant="outline" className="w-full" onClick={() => setVisible((v) => v + 4)}>
                      Load more reviews
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default DetailTabs
