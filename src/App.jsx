import { useState } from "react";
import ResponsiveDataDisplay from "./ResponsiveDataDisplay";
import BillingDisplay from "./BillingDisplay";

const pages = [
  { key: "responsive", label: "Responsive Data Display", component: ResponsiveDataDisplay },
  { key: "billing", label: "Billing Display", component: BillingDisplay },
];

export default function App() {
  const [active, setActive] = useState(pages[0].key);
  const ActivePage = pages.find((p) => p.key === active).component;

  return (
    <>
      <nav style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 4,
        padding: 4,
        background: "rgba(17,24,39,0.92)",
        backdropFilter: "blur(12px)",
        borderRadius: 10,
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        zIndex: 9999,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {pages.map((p) => (
          <button
            key={p.key}
            onClick={() => setActive(p.key)}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              borderRadius: 7,
              cursor: "pointer",
              transition: "all 0.15s ease",
              background: active === p.key ? "#fff" : "transparent",
              color: active === p.key ? "#111827" : "#9ca3af",
              whiteSpace: "nowrap",
            }}
          >
            {p.label}
          </button>
        ))}
      </nav>
      <ActivePage />
    </>
  );
}
