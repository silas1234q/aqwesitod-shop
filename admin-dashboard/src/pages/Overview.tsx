import { Link } from "react-router";
import { analytics, orders, products } from "../data";
import { Badge, Card, ORDER_BADGE } from "../components/Ui";

const BAR_MAX = Math.max(...analytics.revenue.map((r) => r.value));

export default function Overview() {
  const activeProducts = products.filter((p) => p.status === "active").length;

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const orderTotal = analytics.ordersByStatus.reduce((s, x) => s + x.count, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-[22px] sm:text-[26px] lg:text-[28px] font-bold tracking-[-0.04em] text-[#1A1A1A]">
            Overview
          </h1>
          <p className="text-[12px] sm:text-[13px] text-[#7A7772] mt-1.5 font-medium">
            {todayLabel} · {activeProducts} active products
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
        {[
          {
            label: "Total Revenue",
            value: `$${(analytics.stats.totalRevenue / 1000).toFixed(1)}k`,
            change: analytics.stats.revenueChange,
          },
          {
            label: "Total Orders",
            value: analytics.stats.totalOrders.toLocaleString(),
            change: analytics.stats.ordersChange,
          },
          {
            label: "Customers",
            value: analytics.stats.totalCustomers.toLocaleString(),
            change: analytics.stats.customersChange,
          },
          {
            label: "Avg. Order Value",
            value: `$${analytics.stats.avgOrderValue}`,
            change: analytics.stats.aovChange,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl ring-1 ring-[#E5E3DE] p-4 sm:p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow cursor-default"
          >
            <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.07em] text-[#7A7772] mb-3">
              {s.label}
            </div>
            <div className="text-[26px] sm:text-[28px] lg:text-[30px] font-bold tracking-[-0.04em] text-[#1A1A1A] leading-none mb-2">
              {s.value}
            </div>
            <div
              className={`text-[12px] font-semibold ${
                s.change > 0 ? "text-emerald-700" : "text-red-600"
              }`}
            >
              {s.change > 0 ? "↑" : "↓"} {Math.abs(s.change)}% vs last month
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 sm:gap-5 mb-4 sm:mb-5">
        {/* Revenue */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
            <div>
              <div className="text-[14px] sm:text-[15px] font-bold text-[#1A1A1A] tracking-tight">
                Revenue Trend
              </div>
              <div className="text-[12px] text-[#7A7772] mt-0.5">
                Last 6 months
              </div>
            </div>
            <div className="sm:text-right">
              <div className="mono text-[18px] sm:text-[22px] font-bold text-[#1A1A1A]">
                ${((analytics.revenue.at(-1)!.value ?? 0) / 1000).toFixed(1)}k
              </div>
              <div className="text-[11px] text-[#7A7772]">this month</div>
            </div>
          </div>

          <div className="flex items-end gap-2 sm:gap-2.5 h-32 sm:h-36">
            {analytics.revenue.map((r, i) => {
              const pct = BAR_MAX ? (r.value / BAR_MAX) * 100 : 0;
              const isLast = i === analytics.revenue.length - 1;

              return (
                <div
                  key={r.month}
                  className="flex-1 flex flex-col items-center gap-1.5 min-w-0"
                >
                  <span className="mono text-[10px] text-[#7A7772] hidden sm:block">
                    ${(r.value / 1000).toFixed(0)}k
                  </span>

                  <div className="w-full flex items-end flex-1">
                    <div
                      className={`w-full rounded-t-lg rounded-b transition-all ${
                        isLast ? "bg-[#1A1A1A]" : "bg-[#E5E3DE]"
                      }`}
                      style={{ height: `${pct}%`, minHeight: 6 }}
                      title={`${r.month}: $${(r.value / 1000).toFixed(0)}k`}
                    />
                  </div>

                  <span
                    className={`text-[10px] font-semibold ${
                      isLast
                        ? "text-[#1A1A1A] font-bold"
                        : "text-[#7A7772]"
                    }`}
                  >
                    {r.month}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Order status */}
        <Card className="p-4 sm:p-6">
          <div className="text-[14px] sm:text-[15px] font-bold text-[#1A1A1A] tracking-tight mb-1">
            Order Status
          </div>
          <div className="text-[12px] text-[#7A7772] mb-5">
            Current distribution
          </div>

          <div className="space-y-3.5">
            {analytics.ordersByStatus.map(({ status, count }) => {
              const pct = orderTotal ? Math.round((count / orderTotal) * 100) : 0;

              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-semibold capitalize text-[#1A1A1A]">
                      {status}
                    </span>
                    <span className="mono text-[11px] text-[#7A7772]">
                      {count} · {pct}%
                    </span>
                  </div>

                  <div className="h-1.5 bg-[#E5E3DE] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1A1A1A] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Top products */}
        <Card padding={false}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-[#E5E3DE]/60">
            <div>
              <div className="text-[14px] sm:text-[15px] font-bold text-[#1A1A1A] tracking-tight">
                Top Products
              </div>
              <div className="text-[12px] text-[#7A7772]">By revenue</div>
            </div>
            <Link
              to="/products"
              className="text-[12px] font-semibold text-[#1A1A1A] hover:text-[#7A7772] transition-colors w-fit"
            >
              View all →
            </Link>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {analytics.topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#E5E3DE] text-[#7A7772] text-[11px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#1A1A1A] truncate">
                    {p.name}
                  </div>
                  <div className="text-[11px] text-[#7A7772]">
                    {p.sales} sold
                  </div>
                </div>
                <div className="mono text-[12px] font-bold text-[#1A1A1A]">
                  ${(p.revenue / 1000).toFixed(1)}k
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent orders */}
        <Card padding={false}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-[#E5E3DE]/60">
            <div>
              <div className="text-[14px] sm:text-[15px] font-bold text-[#1A1A1A] tracking-tight">
                Recent Orders
              </div>
              <div className="text-[12px] text-[#7A7772]">Latest activity</div>
            </div>
            <Link
              to="/orders"
              className="text-[12px] font-semibold text-[#1A1A1A] hover:text-[#7A7772] transition-colors w-fit"
            >
              View all →
            </Link>
          </div>

          <div>
            {orders.slice(0, 5).map((o) => (
              <div
                key={o.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 border-b border-[#E5E3DE]/40 last:border-0 hover:bg-[#faf9f6] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#1A1A1A]">
                    {o.customer}
                  </div>
                  <div className="mono text-[10.5px] text-[#7A7772] truncate">
                    {o.id}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <Badge variant={ORDER_BADGE[o.status]}>{o.status}</Badge>
                  <div className="mono text-[12px] font-bold text-[#1A1A1A]">
                    ${o.total}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}