import CategoriesSection from "@/components/admin/CategoriesSection"

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6 p-2">
      <div>
        <h1 className="text-2xl font-bold">Category Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create, edit, and delete herb categories
        </p>
      </div>
      <CategoriesSection />
    </div>
  )
}
