// Format currency as South African Rand (e.g., R 1,250.00)
export function fmt$(amount) {
  const val = Number(amount) || 0;
  return `R ${val.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Format hours display
export function fmtH(hours) {
  const val = Number(hours) || 0;
  return `${val}h`;
}

// Calculate SA UIF (1% employee, 1% employer, capped at R177.12)
export function calcUIF(gross) {
  const val = Number(gross) || 0;
  const maxCap = 17712;
  const cappedGross = Math.min(val, maxCap);
  const uifAmount = cappedGross * 0.01;

  return {
    employee: uifAmount,
    employer: uifAmount,
  };
}

// Generate unique week key for Firestore indexing
export function getWeekKey(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset * 7);

  const day = date.getDay();
  const diffToMon = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diffToMon));

  const yyyy = monday.getFullYear();
  const mm = String(monday.getMonth() + 1).padStart(2, "0");
  const dd = String(monday.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

// Format week label for human display (e.g., 17 Aug 2026 – 23 Aug 2026)
export function getWeekLabel(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset * 7);

  const day = date.getDay();
  const diffToMon = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diffToMon));

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const opts = { day: "numeric", month: "short", year: "numeric" };
  return `${monday.toLocaleDateString("en-ZA", opts)} – ${sunday.toLocaleDateString("en-ZA", opts)}`;
}