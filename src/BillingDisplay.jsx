import { useState, useEffect, Children } from "react";

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

// Max-width per visible column count so groups don't stretch edge-to-edge
// on wide screens. Keyed by how many columns are actually rendered.
const MAX_WIDTH_BY_COLS = {
  1: "28rem",
  2: "56rem",
};

function ResponsiveRow({ children, width }) {
  const items = Children.toArray(children);
  const count = items.length;
  let maxCols = 1;
  if (width >= 900) maxCols = 4;
  else if (width >= 560) maxCols = 2;

  const cols = count <= maxCols ? Math.min(count, maxCols) : maxCols;
  const maxW = MAX_WIDTH_BY_COLS[Math.min(cols, 4)] ?? undefined;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: cols === 1 ? 16 : 32,
        maxWidth: maxW,
      }}
    >
      {items}
    </div>
  );
}

const ChevronDown = ({ open }) => (
  <svg
    width="16" height="16" viewBox="0 0 16 16" fill="none"
    style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s ease" }}
  >
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GreenDot = () => (
  <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#22c55e", marginRight: 6 }} />
);

function BillingField({ label, value }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      padding: "10px 14px",
      fontSize: 13,
      background: "#f5f5f5",
      borderRadius: 6,
      marginBottom: 4,
    }}>
      <span style={{ flex: 1, color: "#6b7280", fontWeight: 500, textAlign: "right" }}>
        {label}
      </span>
      <span style={{
        flex: 1,
        color: "#111827",
        fontWeight: 600,
        fontVariantNumeric: "tabular-nums",
        textAlign: "right",
      }}>
        {value}
      </span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: "#374151",
        paddingBottom: 6, borderBottom: "2px solid #e5e7eb", marginBottom: 6,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function CollapsiblePanel({ title, tag, badge, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", marginBottom: 16, background: "#fff" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "12px 16px",
          background: "#f9fafb", border: "none", borderBottom: open ? "1px solid #e5e7eb" : "none",
          cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#111827",
        }}
      >
        <ChevronDown open={open} />
        <span>{title}</span>
        {tag && (
          <span style={{ display: "inline-flex", alignItems: "center", fontSize: 12, fontWeight: 500, color: "#22c55e", marginLeft: 4 }}>
            <GreenDot />{tag}
          </span>
        )}
        {badge && (
          <span style={{
            marginLeft: "auto", fontSize: 11, fontWeight: 600, padding: "2px 8px",
            borderRadius: 99, background: "#eff6ff", color: "#2563eb",
          }}>
            {badge}
          </span>
        )}
      </button>
      {open && <div style={{ padding: "16px 20px" }}>{children}</div>}
    </div>
  );
}

function WidthIndicator({ width }) {
  let label, color, bg;
  if (width >= 900) { label = `4-col max (${width}px)`; color = "#065f46"; bg = "#d1fae5"; }
  else if (width >= 560) { label = `2-col max (${width}px)`; color = "#92400e"; bg = "#fef3c7"; }
  else { label = `1-col (${width}px)`; color = "#991b1b"; bg = "#fee2e2"; }
  return (
    <span style={{ display: "inline-block", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 99, color, background: bg }}>
      {label}
    </span>
  );
}

export default function BillingDisplay() {
  const width = useWindowWidth();

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: 20, color: "#111827",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Billing Data Display</h2>
        <WidthIndicator width={width} />
      </div>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
        Resize to see breakpoints. All values are right-aligned with tabular numerals.
      </p>

      {/* ── 1 GROUP ── */}
      <CollapsiblePanel title="Summary" badge="1 group → 1 col · max 28rem">
        <ResponsiveRow width={width}>
          <Section title="Claim Summary">
            <BillingField label="Billed Amount" value="$11,117,431.76" />
            <BillingField label="Allowed Amount" value="$18,000.00" />
            <BillingField label="Paid Amount" value="$16,420.35" />
            <BillingField label="Adjustment" value="$1,579.65" />
            <BillingField label="Balance Due" value="$11,099,431.76" />
          </Section>
        </ResponsiveRow>
      </CollapsiblePanel>

      {/* ── 2 GROUPS ── */}
      <CollapsiblePanel title="Authorization" badge="2 groups → 2 cols · max 56rem">
        <ResponsiveRow width={width}>
          <Section title="Auth Amounts">
            <BillingField label="Requested Amount" value="$48,230.00" />
            <BillingField label="Approved Amount" value="$32,150.00" />
            <BillingField label="Contractual Adj" value="$16,080.00" />
            <BillingField label="Net Payable" value="$32,150.00" />
          </Section>
          <Section title="Service Costs">
            <BillingField label="Room & Board" value="$14,200.00" />
            <BillingField label="Pharmacy" value="$8,450.00" />
            <BillingField label="Lab Services" value="$3,780.00" />
            <BillingField label="Imaging" value="$5,720.00" />
          </Section>
        </ResponsiveRow>
      </CollapsiblePanel>

      {/* ── 3 GROUPS ── */}
      <CollapsiblePanel title="Provider Payments" badge="3 groups → 3 cols">
        <ResponsiveRow width={width}>
          <Section title="Attending Provider">
            <BillingField label="Professional Fee" value="$6,800.00" />
            <BillingField label="Consult Fee" value="$1,200.00" />
            <BillingField label="Total Paid" value="$8,000.00" />
          </Section>
          <Section title="Facility">
            <BillingField label="Facility Fee" value="$22,350.00" />
            <BillingField label="Supply Charges" value="$4,120.00" />
            <BillingField label="Total Paid" value="$26,470.00" />
          </Section>
          <Section title="Referring Provider">
            <BillingField label="Referral Fee" value="$350.00" />
            <BillingField label="Admin Fee" value="$75.00" />
            <BillingField label="Total Paid" value="$425.00" />
          </Section>
        </ResponsiveRow>
      </CollapsiblePanel>

      {/* ── 4 GROUPS ── */}
      <CollapsiblePanel title="Patient Financials" badge="4 groups → 4 cols">
        <ResponsiveRow width={width}>
          <Section title="Billed Amounts">
            <BillingField label="Total Billed" value="$48,230.00" />
            <BillingField label="Allowed" value="$32,150.00" />
            <BillingField label="Contractual Adj" value="$16,080.00" />
          </Section>
          <Section title="Payments">
            <BillingField label="Insurance Paid" value="$25,720.00" />
            <BillingField label="Patient Paid" value="$1,950.00" />
            <BillingField label="Total Paid" value="$27,670.00" />
          </Section>
          <Section title="Patient Responsibility">
            <BillingField label="Deductible" value="$1,200.00" />
            <BillingField label="Coinsurance" value="$3,230.00" />
            <BillingField label="Copay" value="$50.00" />
            <BillingField label="Total Patient" value="$4,480.00" />
          </Section>
          <Section title="Recovery">
            <BillingField label="Recovery Amt" value="$12,354.78" />
            <BillingField label="Interest" value="$0.00" />
            <BillingField label="Withhold" value="$0.00" />
            <BillingField label="Net Recovery" value="$12,354.78" />
          </Section>
        </ResponsiveRow>
      </CollapsiblePanel>

      {/* ── 5 GROUPS ── */}
      <CollapsiblePanel title="Line Item Charges" tag="Recoverable" badge="5 groups → 4 cols + overflow">
        <ResponsiveRow width={width}>
          <Section title="Room & Board">
            <BillingField label="ICU (3 days)" value="$8,400.00" />
            <BillingField label="Semi-Private (4 days)" value="$5,800.00" />
            <BillingField label="Total" value="$14,200.00" />
          </Section>
          <Section title="Pharmacy">
            <BillingField label="IV Medications" value="$4,200.00" />
            <BillingField label="Oral Medications" value="$1,850.00" />
            <BillingField label="Supplies" value="$2,400.00" />
            <BillingField label="Total" value="$8,450.00" />
          </Section>
          <Section title="Lab Services">
            <BillingField label="Blood Work" value="$1,280.00" />
            <BillingField label="Cultures" value="$950.00" />
            <BillingField label="Pathology" value="$1,550.00" />
            <BillingField label="Total" value="$3,780.00" />
          </Section>
          <Section title="Imaging">
            <BillingField label="CT Scan" value="$2,800.00" />
            <BillingField label="X-Ray" value="$920.00" />
            <BillingField label="Ultrasound" value="$2,000.00" />
            <BillingField label="Total" value="$5,720.00" />
          </Section>
          <Section title="Other Charges">
            <BillingField label="Anesthesia" value="$3,600.00" />
            <BillingField label="OR Time" value="$8,200.00" />
            <BillingField label="Respiratory" value="$4,280.00" />
            <BillingField label="Total" value="$16,080.00" />
          </Section>
        </ResponsiveRow>
      </CollapsiblePanel>
    </div>
  );
}
