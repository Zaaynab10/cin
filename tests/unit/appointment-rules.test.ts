import { describe, it, expect, vi, afterEach } from "vitest";
import {
  canDisplaySlotForType,
  canModifyBefore48h,
} from "../../src/features/appointment/lib/appointment-rules";

// ─── canDisplaySlotForType ─────────────────────────────────────────────────

describe("canDisplaySlotForType", () => {
  it("retourne true pour pickup", () => {
    expect(canDisplaySlotForType("pickup")).toBe(true);
  });

  it("retourne true pour new_request", () => {
    expect(canDisplaySlotForType("new_request")).toBe(true);
  });

  it("retourne true pour renewal", () => {
    expect(canDisplaySlotForType("renewal")).toBe(true);
  });
});

// ─── canModifyBefore48h ────────────────────────────────────────────────────

describe("canModifyBefore48h", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("retourne true si le RDV est dans exactement 48h", () => {
    const now = new Date("2026-04-08T10:00:00Z").getTime();
    vi.spyOn(Date, "now").mockReturnValue(now);

    const startAt = new Date("2026-04-10T10:00:00Z").toISOString();
    expect(canModifyBefore48h(startAt)).toBe(true);
  });

  it("retourne true si le RDV est dans plus de 48h", () => {
    const now = new Date("2026-04-08T10:00:00Z").getTime();
    vi.spyOn(Date, "now").mockReturnValue(now);

    const startAt = new Date("2026-04-15T10:00:00Z").toISOString();
    expect(canModifyBefore48h(startAt)).toBe(true);
  });

  it("retourne false si le RDV est dans moins de 48h", () => {
    const now = new Date("2026-04-08T10:00:00Z").getTime();
    vi.spyOn(Date, "now").mockReturnValue(now);

    const startAt = new Date("2026-04-09T10:00:00Z").toISOString();
    expect(canModifyBefore48h(startAt)).toBe(false);
  });

  it("retourne false si le RDV est dans 1 heure", () => {
    const now = new Date("2026-04-08T10:00:00Z").getTime();
    vi.spyOn(Date, "now").mockReturnValue(now);

    const startAt = new Date("2026-04-08T11:00:00Z").toISOString();
    expect(canModifyBefore48h(startAt)).toBe(false);
  });

  it("retourne false si le RDV est déjà passé", () => {
    const now = new Date("2026-04-08T10:00:00Z").getTime();
    vi.spyOn(Date, "now").mockReturnValue(now);

    const startAt = new Date("2026-04-07T10:00:00Z").toISOString();
    expect(canModifyBefore48h(startAt)).toBe(false);
  });

  it("retourne false si 47h59 avant le RDV", () => {
    const now = new Date("2026-04-08T10:01:00Z").getTime();
    vi.spyOn(Date, "now").mockReturnValue(now);

    // RDV dans 47h59
    const startAt = new Date("2026-04-10T10:00:00Z").toISOString();
    expect(canModifyBefore48h(startAt)).toBe(false);
  });
});
