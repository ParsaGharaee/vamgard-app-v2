/**
 * Lightweight client session for the app (localStorage).
 * Backend gateway will mirror this via X-App-Session when deployed.
 */

export type AppUser = {
  mobile?: string;
  name?: string;
  city?: string;
  job?: string;
  nationalCode?: string;
  /** Credit score 0–900 when known */
  creditScore?: number;
  creditGrade?: string;
  loggedIn: boolean;
};

const KEY = "vamgard_session_v1";

export function loadSession(): AppUser {
  if (typeof window === "undefined") return { loggedIn: false };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { loggedIn: false };
    return { loggedIn: false, ...JSON.parse(raw) };
  } catch {
    return { loggedIn: false };
  }
}

export function saveSession(u: AppUser) {
  localStorage.setItem(KEY, JSON.stringify(u));
  window.dispatchEvent(new Event("vamgard-session"));
}

export function clearSession() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("vamgard-session"));
}

export function useSessionListener(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const h = () => cb();
  window.addEventListener("vamgard-session", h);
  window.addEventListener("storage", h);
  return () => {
    window.removeEventListener("vamgard-session", h);
    window.removeEventListener("storage", h);
  };
}

/** Map Iranian ICS-style bands on 0–900 */
export function gradeFromScore(score: number): string {
  if (score >= 680) return "A1";
  if (score >= 620) return "A2";
  if (score >= 580) return "B1";
  if (score >= 540) return "B2";
  if (score >= 500) return "C1";
  if (score >= 460) return "C2";
  if (score >= 420) return "D1";
  return "E3";
}
