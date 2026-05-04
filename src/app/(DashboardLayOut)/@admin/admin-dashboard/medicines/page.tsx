import MedicinesSection from "@/components/admin/MedicinesSection"

export default function AdminMedicinesPage() {
  return (
    <div className="space-y-6 p-2">
      <div>
        <h1 className="text-2xl font-bold">Medicine Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View all listed medicines and toggle their active status
        </p>
      </div>
      <MedicinesSection />
    </div>
  )
}
