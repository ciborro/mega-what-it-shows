// Splits a merged ticket into the problems its reports describe. One problem, one ticket.
// Counts follow the desk's own view (causes.ts, as on the CauseTable): every report is filed under the
// cause its tenant and channel point to. desk-notes.json lists the reports the desk read as a one-day
// move: no month/day flip, so a problem of its own. They get their own row and stay counted where filed.
import { groupByCause, uniqueById, type Cause, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = Cause | 'one-day';

export type ProblemGroup = {
  problem: Problem | 'unplaced';
  reports: Report[];
  tenants: string[];
  firstSeen: string;
  lastSeen: string;
  // For `one-day`: the cause these reports are filed under.
  filedUnder: string[];
};

function group(problem: ProblemGroup['problem'], reports: Report[], filedUnder: string[] = []): ProblemGroup {
  const days = reports.map((r) => r.receivedAt.slice(0, 10)).sort();
  return {
    problem,
    reports,
    tenants: [...new Set(reports.map((r) => r.tenant))].sort(),
    firstSeen: days[0],
    lastSeen: days[days.length - 1],
    filedUnder,
  };
}

// Every unique report merged into `ticket`: one row per cause, plus the one-day moves.
export function splitTicket(
  all: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { merged: number; groups: ProblemGroup[] } {
  const merged = uniqueById(all).filter((r) => r.mergedInto === ticket);
  const groups = groupByCause(merged, tenantOf).map((g) => group(g.cause, g.reports));
  const moved = merged.filter((r) => oneDayMove.includes(r.id));
  if (moved.length) {
    const filedUnder = groups.filter((g) => g.reports.some((r) => oneDayMove.includes(r.id))).map((g) => g.problem);
    groups.push(group('one-day', moved, filedUnder));
  }
  return { merged: merged.length, groups };
}
