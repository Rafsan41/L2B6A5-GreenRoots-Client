import ApprovalsSection from "@/components/admin/ApprovalsSection"

export default function AdminApprovalsPage() {
  return (
    <div className="space-y-6 p-2">
      <div>
        <h1 className="text-2xl font-bold">Manager Approvals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and approve or suspend pending seller registrations
        </p>
      </div>
      <ApprovalsSection />
    </div>
  )
}
