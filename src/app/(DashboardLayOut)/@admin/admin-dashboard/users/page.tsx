import UsersSection from "@/components/admin/UsersSection"

export default function AdminUsersPage() {
  return (
    <div className="space-y-6 p-2">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View, search, and update the status of all platform users
        </p>
      </div>
      <UsersSection />
    </div>
  )
}
