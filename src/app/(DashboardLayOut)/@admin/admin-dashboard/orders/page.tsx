import OrdersSection from "@/components/admin/OrdersSection"

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6 p-2">
      <div>
        <h1 className="text-2xl font-bold">Order Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor and update the status of all platform orders
        </p>
      </div>
      <OrdersSection />
    </div>
  )
}
