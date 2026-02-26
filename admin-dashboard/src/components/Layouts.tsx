import { NavLink, Outlet, useNavigation } from "react-router";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  {
    section: "Main",
    links: [
      { to: "/", label: "Overview", icon: <OverviewIcon />, end: true },
      { to: "/products", label: "Products", icon: <ProductsIcon /> },
      { to: "/orders", label: "Orders", icon: <OrdersIcon /> },
      { to: "/customers", label: "Customers", icon: <CustomersIcon /> },
    ],
  },
  {
    section: "System",
    links: [{ to: "/settings", label: "Settings", icon: <SettingsIcon /> }],
  },
];

export default function Layout() {
  const { state } = useNavigation();
  const loading = state === "loading";

  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll when drawer is open (mobile)
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const Sidebar = ({ onNavigate }: { onNavigate?: () => void }) => (
    <aside className="h-dvh w-58 shrink-0 bg-white flex flex-col border-r border-[#E5E3DE] overflow-hidden  lg:relative z-50">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-[#E5E3DE]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#faf9f6"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div className="text-[15px] font-bold tracking-[-0.02em] text-[#1A1A1A]">
              Aqwesitod
            </div>
            <div className="text-[10px] text-[#7A7772] font-medium">
              Admin Dashboard
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {NAV_ITEMS.map(({ section, links }) => (
          <div key={section}>
            <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7A7772]/60 px-2 mb-2">
              {section}
            </div>
            <div className="space-y-0.5">
              {links.map(({ to, label, icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-[#1A1A1A] text-[#faf9f6] font-semibold"
                        : "text-[#7A7772] hover:bg-[#E5E3DE] hover:text-[#1A1A1A]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? "text-[#faf9f6]" : "text-[#7A7772]"
                        }`}
                      >
                        {icon}
                      </span>
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[#E5E3DE]">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-[#faf9f6] cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-[9px] bg-[#E5E3DE] text-[#1A1A1A] text-[11px] font-bold flex items-center justify-center shrink-0">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] font-semibold text-[#1A1A1A] leading-none">
              Admin User
            </div>
            <div className="text-[10.5px] text-[#7A7772] mt-0.5 truncate">
              admin@prism.app
            </div>
          </div>
          <svg
            className="w-3.5 h-3.5 text-[#7A7772]/50 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </div>
      </div>
    </aside>
  );

  return (
    <div
      className="min-h-dvh bg-[#faf9f6]"
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { font-family: 'Sora', sans-serif; box-sizing: border-box; }
        .mono { font-family: 'JetBrains Mono', monospace !important; }
        @keyframes rise   { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
        @keyframes barProg { from { transform: scaleX(0.05); transform-origin: left } to { transform: scaleX(1); transform-origin: left } }
      `}</style>

      <div className="flex min-h-dvh overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-58 z-50">
          <Sidebar />
        </div>

        {/* Mobile topbar */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#E5E3DE]">
          <div className="h-14 px-4 flex items-center justify-between">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl hover:bg-[#E5E3DE] transition-colors"
              aria-label="Open menu"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            <div className="text-[13px] font-bold tracking-[-0.02em] text-[#1A1A1A]">
              Aqwesitod
            </div>

            <div className="w-9 h-9 rounded-[10px] bg-[#E5E3DE] text-[#1A1A1A] text-[11px] font-bold flex items-center justify-center">
              AD
            </div>
          </div>
        </header>

        {/* Mobile drawer */}
        <div
          className={`lg:hidden fixed inset-0 z-50 ${
            mobileOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
              mobileOpen ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`absolute top-0 left-0 h-dvh w-67.5 bg-white shadow-2xl transform transition-transform duration-200 ${
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>

        {/* Main */}
        <main
          className={`
            flex-1 overflow-y-auto relative transition-opacity duration-150
            ${loading ? "opacity-50 pointer-events-none" : ""}
            pt-14 lg:pt-0
            lg:pl-58
          `}
        >
          {loading && (
            <div className="fixed top-0 left-0 right-0 h-0.5 z-60 bg-[#1A1A1A] animate-[barProg_700ms_ease_forwards]" />
          )}
          <div className="animate-[rise_220ms_ease_both] p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

/* Icons (unchanged) */
function OverviewIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function ProductsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}
function OrdersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
function CustomersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
