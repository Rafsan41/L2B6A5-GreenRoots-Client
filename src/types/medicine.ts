export interface MedicineCategory {
  id:   string
  name: string
  slug: string
}

export interface MedicineSeller {
  id:   string
  name: string
}

export interface Medicine {
  id:                   string
  name:                 string
  slug:                 string
  description:          string
  price:                string        // API returns price as string
  stock:                number
  image:                string | null
  images:               string[]
  manufacturer:         string
  dosage:               string | null
  form:                 string | null
  prescriptionRequired: boolean
  isActive:             boolean
  createdAt:            string        // ISO date string
  updatedAt:            string
  sellerId:             string
  categoryId:           string
  category:             MedicineCategory
  seller:               MedicineSeller

  // Detail page enrichment fields
  isFeatured:   boolean
  keyBadges:    string[]
  uses:         string[]
  ingredients:  string | null
  sideEffects:  string[]
  storage:      string | null

  // Structured dosage (flat columns in DB)
  dosageAdults:   string | null
  dosageChildren: string | null
  dosageMaxDaily: string | null
  dosageNotes:    string | null

  // Aggregated from Review relation (computed by backend)
  rating:      number
  reviewCount: number
}
