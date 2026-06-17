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

function ResponsiveRow({ children, width }) {
  const items = Children.toArray(children);
  const count = items.length;
  let maxCols = 1;
  if (width >= 1200) maxCols = 4;
  else if (width >= 768) maxCols = 2;

  // If count fits in one row, auto-fill (no empty cells).
  // If count overflows, keep maxCols so overflow items stay the same width.
  if (count <= maxCols) {
    const cols = Math.min(count, maxCols);
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: cols === 1 ? 16 : 32,
        }}
      >
        {items}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
        gap: maxCols === 1 ? 16 : 32,
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

function Field({ label, value }) {
  return (
    <div style={{ display: "flex", padding: "5px 0", fontSize: 13 }}>
      <span style={{ color: "#6b7280", minWidth: 130, textAlign: "right", paddingRight: 12, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ color: "#111827", fontWeight: 500, wordBreak: "break-word" }}>
        {value}
      </span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", paddingBottom: 6, borderBottom: "2px solid #e5e7eb", marginBottom: 6 }}>
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
  if (width >= 1200) { label = `4-col max (${width}px)`; color = "#065f46"; bg = "#d1fae5"; }
  else if (width >= 768) { label = `2-col max (${width}px)`; color = "#92400e"; bg = "#fef3c7"; }
  else { label = `1-col (${width}px)`; color = "#991b1b"; bg = "#fee2e2"; }
  return (
    <span style={{ display: "inline-block", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 99, color, background: bg }}>
      {label}
    </span>
  );
}

export default function ResponsiveDataDisplay() {
  const width = useWindowWidth();

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: 20, color: "#111827",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Responsive Data Display</h2>
        <WidthIndicator width={width} />
      </div>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
        Resize to see breakpoints. Groups auto-fill available width — no empty cells.
      </p>

      {/* ── 1 GROUP ── */}
      <CollapsiblePanel title="Notes" badge="1 group → 1 col">
        <ResponsiveRow width={width}>
          <Section title="Review Notes">
            <Field label="Created by" value="Cameron Williamson" />
            <Field label="Created on" value="May 14, 2024" />
            <Field label="Priority" value="High" />
            <Field label="Category" value="Clinical Review" />
            <Field label="Status" value="In Progress" />
          </Section>
        </ResponsiveRow>
      </CollapsiblePanel>

      {/* ── 2 GROUPS ── */}
      <CollapsiblePanel title="Authorization" badge="2 groups → 2 cols">
        <ResponsiveRow width={width}>
          <Section title="Auth Details">
            <Field label="Auth Number" value="AUTH-2024-78901" />
            <Field label="Type" value="Inpatient" />
            <Field label="Status" value="Approved" />
            <Field label="Requested On" value="May 10, 2024" />
            <Field label="Approved On" value="May 11, 2024" />
          </Section>
          <Section title="Service Period">
            <Field label="Start Date" value="May 12, 2024" />
            <Field label="End Date" value="May 19, 2024" />
            <Field label="Approved Days" value="7" />
            <Field label="Used Days" value="7" />
          </Section>
        </ResponsiveRow>
      </CollapsiblePanel>

      {/* ── 3 GROUPS ── */}
      <CollapsiblePanel title="Provider" badge="3 groups → 3 cols">
        <ResponsiveRow width={width}>
          <Section title="Attending Provider">
            <Field label="Name" value="Dr. Sarah Chen" />
            <Field label="NPI" value="1234567890" />
            <Field label="Specialty" value="Internal Medicine" />
            <Field label="Phone" value="(555) 123-4567" />
          </Section>
          <Section title="Facility">
            <Field label="Name" value="St. Mary's Hospital" />
            <Field label="NPI" value="9876543210" />
            <Field label="Address" value="123 Medical Dr" />
            <Field label="City" value="Austin, TX 78701" />
            <Field label="Tax ID" value="12-3456789" />
          </Section>
          <Section title="Referring Provider">
            <Field label="Name" value="Dr. James Wilson" />
            <Field label="NPI" value="5678901234" />
            <Field label="Specialty" value="Family Medicine" />
          </Section>
        </ResponsiveRow>
      </CollapsiblePanel>

      {/* ── 4 GROUPS ── */}
      <CollapsiblePanel title="Patient" badge="4 groups → 4 cols">
        <ResponsiveRow width={width}>
          <Section title="Patient Info">
            <Field label="Patient Name" value="John Doe" />
            <Field label="DOB" value="May 12, 1972" />
            <Field label="Age" value="79 years" />
            <Field label="Sex" value="F" />
            <Field label="Zip" value="-" />
          </Section>
          <Section title="Insurance Info">
            <Field label="Fund Type" value="MEDICARE" />
            <Field label="Plan State" value="AK" />
            <Field label="Group Number" value="123456 / 202" />
            <Field label="Relationship Code" value="1" />
            <Field label="Effective Date" value="May 12, 2024" />
            <Field label="Termination Date" value="May 12, 2024" />
          </Section>
          <Section title="Patient IDs">
            <Field label="Member ID" value="1234567890" />
            <Field label="Patient Acct #" value="12345678912" />
            <Field label="Subscriber ID" value="123456789" />
            <Field label="Customer Acct #" value="1234567890" />
          </Section>
          <Section title="Claim Info">
            <Field label="Claim Nr" value="bc824faf..." />
            <Field label="Claim Adj #" value="1" />
            <Field label="Status" value="Review Assigned" />
            <Field label="Assigned to" value="Cameron Williamson" />
            <Field label="LOB" value="Medicare" />
          </Section>
        </ResponsiveRow>
      </CollapsiblePanel>

      {/* ── 5 GROUPS ── */}
      <CollapsiblePanel title="Billing" badge="5 groups → 4 cols + overflow">
        <ResponsiveRow width={width}>
          <Section title="Billed Amounts">
            <Field label="Total Billed" value="$48,230.00" />
            <Field label="Allowed" value="$32,150.00" />
            <Field label="Contractual Adj" value="$16,080.00" />
          </Section>
          <Section title="Payment Info">
            <Field label="Paid Amount" value="$25,720.00" />
            <Field label="Check Number" value="EFT-98234" />
            <Field label="Paid Date" value="May 18, 2024" />
            <Field label="Pay-to Provider" value="St. Mary's Hospital" />
          </Section>
          <Section title="Patient Responsibility">
            <Field label="Deductible" value="$1,200.00" />
            <Field label="Coinsurance" value="$3,230.00" />
            <Field label="Copay" value="$50.00" />
            <Field label="Total Patient" value="$4,480.00" />
          </Section>
          <Section title="Adjustments">
            <Field label="COB Savings" value="$1,950.00" />
            <Field label="Withhold" value="$0.00" />
            <Field label="Interest" value="$0.00" />
          </Section>
          <Section title="Recovery">
            <Field label="Recovery Amt" value="$12,354.78" />
            <Field label="Recovery Type" value="Overpayment" />
            <Field label="Recovery Status" value="Open" />
          </Section>
        </ResponsiveRow>
      </CollapsiblePanel>

      {/* ── Charges (4 groups) ── */}
      <CollapsiblePanel title="Charges" tag="Recoverable" badge="4 groups → 4 cols">
        <ResponsiveRow width={width}>
          <Section title="Claim Info">
            <Field label="Claim Number" value="124221523" />
            <Field label="Audit Angle" value="MSDRG - Clinical" />
            <Field label="LOB" value="MEDICAID" />
            <Field label="Paid on" value="May 12, 2024" />
            <Field label="Adjudicated on" value="May 12, 2024" />
            <Field label="Due Date" value="May 12, 2024" />
            <Field label="Expires on" value="May 12, 2026" />
          </Section>
          <Section title="Service Info">
            <Field label="DRG" value="392 (871, 3 MCCs, 0 CCs)" />
            <Field label="Admission Date" value="May 12, 2024" />
            <Field label="Discharge Date" value="May 12, 2024" />
            <Field label="LOS" value="7" />
          </Section>
          <Section title="Subsection">
            <Field label="Label" value="$12,354.78" />
            <Field label="Label" value="$12,354.78" />
            <Field label="Label" value="-" />
            <Field label="Label" value="$12,354.78" />
            <Field label="Label" value="$12,354.78" />
          </Section>
          <Section title="Subsection">
            <Field label="Label" value="$12,354.78" />
            <Field label="Label" value="$12,354.78" />
            <Field label="Label" value="$12,354.78" />
            <Field label="Label" value="$12,354.78" />
            <Field label="Label" value="$12,354.78" />
          </Section>
        </ResponsiveRow>
      </CollapsiblePanel>

      {/* ── Behavior table ── */}
      <div style={{
        marginTop: 8, padding: 16, background: "#f8fafc", border: "1px solid #e2e8f0",
        borderRadius: 8, fontSize: 13, lineHeight: 1.6,
      }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Auto-fill behavior (no empty cells):</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "monospace" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
              <th style={{ padding: "6px 8px" }}>Groups</th>
              <th style={{ padding: "6px 8px" }}>≥900px</th>
              <th style={{ padding: "6px 8px" }}>560–899px</th>
              <th style={{ padding: "6px 8px" }}>&lt;560px</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["1", "1 col   [    A    ]", "1 col   [    A    ]", "1 col  [A]"],
              ["2", "2 cols  [A    B]", "2 cols  [A    B]", "1 col  [A] [B]"],
              ["3", "3 cols  [A  B  C]", "2 cols  [A B] [C _]", "1 col  [A] [B] [C]"],
              ["4", "4 cols  [A B C D]", "2 cols  [A B] [C D]", "1 col  [A] [B] [C] [D]"],
              ["5", "4 cols  [A B C D] [E _ _ _]", "2 cols  [A B] [C D] [E _]", "1 col  [A] [B] [C] [D] [E]"],
            ].map(([n, c4, c2, c1]) => (
              <tr key={n} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "6px 8px", fontWeight: 600 }}>{n}</td>
                <td style={{ padding: "6px 8px" }}>{c4}</td>
                <td style={{ padding: "6px 8px" }}>{c2}</td>
                <td style={{ padding: "6px 8px" }}>{c1}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 12, fontSize: 12, fontFamily: "monospace", color: "#475569" }}>
          cols = Math.min(childCount, maxColsForBreakpoint)
        </div>
      </div>
    </div>
  );
}
