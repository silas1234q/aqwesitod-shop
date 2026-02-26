import { useState } from "react";
import { Btn, Card, Input, Select, Toggle } from "../components/Ui";

const TABS = [
  { id: "general",       label: "General",       emoji: "🏪" },
  { id: "notifications", label: "Notifications", emoji: "🔔" },
  { id: "security",      label: "Security",      emoji: "🔒" },
  { id: "billing",       label: "Billing",       emoji: "💳" },
  { id: "team",          label: "Team",          emoji: "👥" },
];

const TEAM = [
  { name: "Admin User",   email: "admin@prism.app",  role: "Owner",  initials: "AU" },
  { name: "Jordan Kim",   email: "jordan@prism.app", role: "Editor", initials: "JK" },
  { name: "Taylor Smith", email: "taylor@prism.app", role: "Viewer", initials: "TS" },
];

export default function Settings() {
  const [tab, setTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ newOrder: true, shipped: true, lowStock: false, newCustomer: false, weekly: true });

  function save(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="p-8 max-w-195">
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[26px] font-bold tracking-[-0.035em] text-[#1A1A1A]">Settings</h1>
          <p className="text-[13px] text-[#7A7772] mt-1 font-medium">Configure your store preferences</p>
        </div>
        {saved && (
          <div className="px-4 py-2 rounded-xl bg-emerald-50 ring-1 ring-emerald-200 text-emerald-800 text-[13px] font-semibold animate-[rise_200ms_ease]">
            ✓ Saved
          </div>
        )}
      </div>

      <div className="grid grid-cols-[188px_1fr] gap-5">
        {/* Sidebar */}
        <Card className="p-2 h-fit">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium mb-0.5 last:mb-0 transition-all text-left ${
                tab === t.id
                  ? "bg-[#1A1A1A] text-[#faf9f6] font-semibold"
                  : "text-[#7A7772] hover:bg-[#faf9f6] hover:text-[#1A1A1A]"
              }`}
            >
              <span>{t.emoji}</span>{t.label}
            </button>
          ))}
        </Card>

        {/* Content */}
        <div>
          {tab === "general" && (
            <form onSubmit={save} className="space-y-4">
              <Card className="p-5">
                <div className="text-[14px] font-bold text-[#1A1A1A] mb-4">Store Details</div>
                <div className="space-y-3">
                  <Input label="Store Name" defaultValue="Prism Store" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Support Email" type="email" defaultValue="support@prism.app" />
                    <Input label="Phone" defaultValue="+1 (555) 000-0000" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#7A7772] uppercase tracking-[0.04em]">Store URL</label>
                    <div className="flex">
                      <span className="px-3 py-2.5 rounded-l-xl bg-[#E5E3DE] ring-1 ring-[#E5E3DE] text-[12px] text-[#7A7772] border-r-0 whitespace-nowrap">https://</span>
                      <input className="flex-1 px-3 py-2.5 rounded-r-xl bg-white ring-1 ring-[#E5E3DE] focus:ring-[#1A1A1A] text-[13px] font-medium text-[#1A1A1A] outline-none transition-all" defaultValue="prism.store" />
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="p-5">
                <div className="text-[14px] font-bold text-[#1A1A1A] mb-4">Regional</div>
                <div className="grid grid-cols-2 gap-3">
                  <Select label="Currency" options={[
                    { value: "usd", label: "USD — US Dollar" }, { value: "eur", label: "EUR — Euro" },
                    { value: "gbp", label: "GBP — British Pound" }, { value: "cad", label: "CAD — Canadian Dollar" },
                  ]} defaultValue="usd" />
                  <Select label="Timezone" options={[
                    { value: "ny", label: "America/New_York (EST)" }, { value: "la", label: "America/Los_Angeles (PST)" },
                    { value: "ldn", label: "Europe/London (GMT)" }, { value: "tky", label: "Asia/Tokyo (JST)" },
                  ]} defaultValue="ny" />
                </div>
              </Card>
              <div className="flex justify-end"><Btn variant="primary" type="submit">Save Changes</Btn></div>
            </form>
          )}

          {tab === "notifications" && (
            <Card className="p-5">
              <div className="text-[14px] font-bold text-[#1A1A1A] mb-4">Email Notifications</div>
              {([
                { key: "newOrder",    label: "New order placed",  desc: "Get notified when a customer places an order" },
                { key: "shipped",     label: "Order shipped",     desc: "Notify when an order has been shipped" },
                { key: "lowStock",    label: "Low stock alert",   desc: "When stock drops below 30 units" },
                { key: "newCustomer", label: "New customer",      desc: "Alert on new customer registrations" },
                { key: "weekly",      label: "Weekly digest",     desc: "A weekly summary of your store performance" },
              ] as const).map(({ key, label, desc }) => (
                <div key={key} className="flex items-center py-3.5 border-b border-[#E5E3DE]/60 last:border-0">
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-[#1A1A1A]">{label}</div>
                    <div className="text-[11.5px] text-[#7A7772] mt-0.5">{desc}</div>
                  </div>
                  <Toggle on={notifs[key]} onChange={(v) => setNotifs((n) => ({ ...n, [key]: v }))} />
                </div>
              ))}
            </Card>
          )}

          {tab === "security" && (
            <form onSubmit={save} className="space-y-4">
              <Card className="p-5">
                <div className="text-[14px] font-bold text-[#1A1A1A] mb-4">Change Password</div>
                <div className="space-y-3">
                  <Input label="Current Password" type="password" placeholder="••••••••" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="New Password" type="password" placeholder="••••••••" />
                    <Input label="Confirm Password" type="password" placeholder="••••••••" />
                  </div>
                </div>
              </Card>
              <Card className="p-5">
                <div className="text-[14px] font-bold text-[#1A1A1A] mb-3">Two-Factor Auth</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-semibold text-[#1A1A1A]">Enable 2FA</div>
                    <div className="text-[11.5px] text-[#7A7772] mt-0.5">Secure your account with an authenticator app</div>
                  </div>
                  <Toggle on={false} onChange={() => {}} />
                </div>
              </Card>
              <div className="flex justify-end"><Btn variant="primary" type="submit">Update</Btn></div>
            </form>
          )}

          {tab === "billing" && (
            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.07em] text-[#7A7772] mb-2">Current Plan</div>
                    <div className="text-[34px] font-extrabold tracking-[-0.04em] text-[#1A1A1A]">Pro</div>
                    <div className="text-[13px] text-[#7A7772] mt-1">$49/month · Renews March 1, 2026</div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#1A1A1A] text-[#faf9f6] text-[11px] font-bold">ACTIVE</span>
                </div>
                <button className="mt-5 px-4 py-2 rounded-xl bg-[#E5E3DE] text-[#1A1A1A] text-[13px] font-semibold hover:bg-[#d5d2cc] transition-colors border-none cursor-pointer">
                  Manage Plan
                </button>
              </Card>
              <Card className="p-5">
                <div className="text-[14px] font-bold text-[#1A1A1A] mb-4">Payment Method</div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#faf9f6] ring-1 ring-[#E5E3DE]">
                  <div className="w-10 h-7 rounded-lg bg-[#E5E3DE] flex items-center justify-center text-sm shrink-0">💳</div>
                  <div>
                    <div className="text-[13px] font-bold text-[#1A1A1A]">Visa ending in 4242</div>
                    <div className="text-[11px] text-[#7A7772]">Expires 08 / 2027</div>
                  </div>
                  <Btn size="sm" className="ml-auto">Update</Btn>
                </div>
              </Card>
            </div>
          )}

          {tab === "team" && (
            <Card className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="text-[14px] font-bold text-[#1A1A1A]">Team Members</div>
                <Btn variant="primary" size="sm">+ Invite</Btn>
              </div>
              {TEAM.map((m) => (
                <div key={m.email} className="flex items-center gap-3 py-3.5 border-b border-[#E5E3DE]/60 last:border-0">
                  <div className="w-9 h-9 rounded-[10px] bg-[#E5E3DE] text-[#1A1A1A] text-[11px] font-bold flex items-center justify-center shrink-0">{m.initials}</div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-[#1A1A1A]">{m.name}</div>
                    <div className="text-[11px] text-[#7A7772]">{m.email}</div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ring-1 ${
                    m.role === "Owner" ? "bg-[#1A1A1A] text-[#faf9f6] ring-[#1A1A1A]" :
                    m.role === "Editor" ? "bg-[#E5E3DE] text-[#1A1A1A] ring-[#E5E3DE]" :
                    "bg-[#faf9f6] text-[#7A7772] ring-[#E5E3DE]"
                  }`}>{m.role}</span>
                  {m.role !== "Owner" && <Btn size="sm" variant="danger">Remove</Btn>}
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}