"use client";

import type { SVGProps } from "react";

/**
 * VamGard Service Icon Set
 * 47 bespoke, consistent vector symbols for the VamGard services catalogue.
 * No icon font or Lucide dependency.
 */

type IconName = keyof typeof iconPaths;

type IconProps = SVGProps<SVGSVGElement> & {
  serviceId: string;
  size?: number;
};

const iconPaths = {
  "card-owner-verification": { main: "M13 17h8M13 21h5M5 7h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z", detail: "M8 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM5.5 16c.5-1.7 1.4-2.5 2.5-2.5s2 .8 2.5 2.5", kind: "card" },
  "live-video-kyc": { main: "M12 3a7 7 0 0 0-7 7v2a7 7 0 0 0 14 0v-2a7 7 0 0 0-7-7Z", detail: "M9 10h.01M15 10h.01M9 14c2 2 4 2 6 0M21 8l2-2v12l-2-2", kind: "face" },
  "video-national-card": { main: "M5 5h14v15H5zM8 9h4M8 12h3M8 16h7", detail: "M16 9l2 2-2 2", kind: "card" },
  "death-status": { main: "M12 21s-8-4.7-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.3-8 11-8 11Z", detail: "M12 9v6M9 12h6", kind: "heart" },
  "foreigner-id": { main: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z", detail: "M3.5 12h17M12 3c2.5 2.6 3.5 5.6 3.5 9s-1 6.4-3.5 9c-2.5-2.6-3.5-5.6-3.5-9S9.5 5.6 12 3Z", kind: "globe" },
  "iban-owner-verification": { main: "M4 10 12 4l8 6M6 10v9M10 10v9M14 10v9M18 10v9M3 21h18", detail: "M16 5l3-2", kind: "bank" },
  "identification-inquiry": { main: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c.8-4 3.5-6 8-6s7.2 2 8 6", detail: "M18 5h3M19.5 3.5v3", kind: "person" },
  "sana-inquiry": { main: "M6 3h9l4 4v14H6zM15 3v5h4", detail: "M9 13h7M9 17h4M9 9h2", kind: "document" },
  "nid-inquiry": { main: "M12 3 4 7v5c0 5 3.5 8 8 10 4.5-2 8-5 8-10V7z", detail: "M12 8v5M12 16h.01", kind: "shield" },
  "mobile-card-verification": { main: "M7 3h10v18H7zM10 6h4M10 18h4", detail: "M17 10l2 2 3-4", kind: "phone" },
  "shahkar-verify": { main: "M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z", detail: "m9 12 2 2 4-5", kind: "shield" },
  "national-card-ocr": { main: "M5 5V3h4M15 3h4v4M19 15v4h-4M9 19H5v-4", detail: "M8 9h8M8 12h5M8 15h3", kind: "scan" },
  "digital-sign-verify": { main: "M4 17c3-7 5-7 6-3s3 4 5-1 3-4 5-1", detail: "M4 21h16M17 5l2-2 3 3-2 2", kind: "signature" },
  "back-cheques": { main: "M5 4h14v16H5zM8 8h8M8 12h5", detail: "M16 14l4 4M20 14l-4 4", kind: "warning" },
  "back-cheques-legal": { main: "M6 3h12v18H6zM9 8h6M9 12h6", detail: "M12 15v2M12 19h.01", kind: "legal" },
  "credit-assessment": { main: "M4 19V5M4 19h17M8 16v-4M13 16V8M18 16V4", detail: "M7 8l5-3 4 1 4-3", kind: "chart" },
  "guaranty-inquiry": { main: "M12 3 4 7v5c0 5 3.5 8 8 10 4.5-2 8-5 8-10V7z", detail: "M8 12h8M12 8v8", kind: "guarantee" },
  "facility-inquiry": { main: "M5 4h14v16H5zM8 8h8M8 12h5M8 16h3", detail: "M16 14l2 2 4-5", kind: "document" },
  "bill-history": { main: "M6 4h12v16l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6", detail: "M9 16h3", kind: "bill" },
  "bill-detail": { main: "M5 3h14v18H5zM8 7h8M8 11h8M8 15h4", detail: "M16 15h.01", kind: "receipt" },
  "bill-inquiry": { main: "M4 7h16v13H4zM4 10h16M8 4v6M16 4v6", detail: "M8 15h3M8 18h6", kind: "calendar" },
  "card-inquiry": { main: "M3 6h18v13H3zM3 10h18", detail: "M7 15h4M16 15h2", kind: "card" },
  "card-to-deposit": { main: "M3 7h8v11H3zM13 7h8v11h-8z", detail: "M9 12h6m-2-2 2 2-2 2", kind: "transfer" },
  "card-to-iban": { main: "M4 5h7v14H4zM15 5h5v14h-5z", detail: "M11 12h4m-2-2 2 2-2 2", kind: "transfer" },
  "deposit-to-iban": { main: "M4 9h16M6 9v9M10 9v9M14 9v9M18 9v9M3 20h18M12 3l8 5H4z", detail: "M12 12v3", kind: "bank" },
  "iban-inquiry": { main: "M4 6h12v12H4zM7 10h6M7 14h4", detail: "M16 16l5 5M18 13a4 4 0 1 0 0 .01", kind: "search" },
  "national-card-image": { main: "M5 5h14v14H5zM8 9h4M8 12h3", detail: "M15 9h1M15 12h1M8 16h8", kind: "id" },
  "postal-code": { main: "M12 21s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12Z", detail: "M12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z", kind: "pin" },
  "postal-code-coordinates": { main: "M12 21s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12Z", detail: "M12 6v6M9 9h6", kind: "pin" },
  "postal-inquiry": { main: "M3 7h13v11H3zM16 11h3l3 3v4h-6", detail: "M7 18a2 2 0 1 0 0 .01M18 18a2 2 0 1 0 0 .01", kind: "package" },
  "negative-score": { main: "M4 18a8 8 0 1 1 16 0M12 12l5-4", detail: "M12 18h.01M8 4l-2-2", kind: "gauge" },
  "car-fines": { main: "M4 15l2-6h12l2 6v4H4zM6 9l2-4h8l2 4", detail: "M7 15h.01M17 15h.01M8 19v2M16 19v2", kind: "car" },
  "freeway-toll": { main: "M4 19h16M6 19V9l6-5 6 5v10", detail: "M9 13h6M9 16h6", kind: "road" },
  "license-check": { main: "M6 3h12v18H6zM9 7h6M9 11h3", detail: "m10 16 2 2 4-5", kind: "license" },
  "third-party-insurance": { main: "M12 3 4 7v5c0 5 3.5 8 8 10 4.5-2 8-5 8-10V7z", detail: "M8 12h8M12 8v8", kind: "shield" },
  "active-plates": { main: "M3 8h18v9H3zM6 11h2M10 11h2M14 11h4", detail: "M7 14h10", kind: "plate" },
  "plate-history": { main: "M4 6h16v12H4zM7 10h10", detail: "M8 14h8M12 3v3", kind: "history" },
  "cleared-cheque": { main: "M5 4h14v16H5zM8 8h8M8 12h4", detail: "m14 14 2 2 4-5", kind: "check" },
  "sayad-serial": { main: "M5 4h14v16H5zM8 8h8M8 12h8M8 16h3", detail: "M16 16h.01", kind: "serial" },
  "sayad-transfers-chain": { main: "M8 8h5a3 3 0 0 1 0 6h-2M16 16h-5a3 3 0 0 1 0-6h2", detail: "M7 6 4 9l3 3M17 12l3 3-3 3", kind: "chain" },
  "sayad-cheque-inquiry": { main: "M5 4h14v16H5zM8 8h8M8 12h5", detail: "M16 15a2 2 0 1 0 0 .01M18 17l2 2", kind: "searchdoc" },
  "sayad-accept-cheque": { main: "M5 4h14v16H5zM8 8h8M8 12h5", detail: "m8 16 2 2 5-5", kind: "accept" },
  "sayad-cancel-cheque": { main: "M5 4h14v16H5zM8 8h8M8 12h5", detail: "M9 15l5 5M14 15l-5 5", kind: "cancel" },
  "board-members": { main: "M4 19v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z", detail: "M16 10a3 3 0 1 0 0-6M17 13h1a3 3 0 0 1 3 3v3", kind: "people" },
  "company-info": { main: "M4 21V5h10v16M14 10h6v11M7 8h2M7 12h2M7 16h2M17 14h1M17 18h1", detail: "M2 21h20", kind: "building" },
  "enamad-inquiry": { main: "M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z", detail: "M8 12h8M12 8v8", kind: "seal" },
  "match-legal-id-members": { main: "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z", detail: "M2 20c.5-3 2.5-5 6-5s5.5 2 6 5M14 15c3.5 0 5.5 1.5 6 5", kind: "people" },
} as const;

const accentByKind: Record<string, string> = {
  card: "M6 6h3", face: "M12 3a7 7 0 0 0-7 7", heart: "M12 8c-1.5-2-4-2-5 0",
  globe: "M12 3v18", bank: "M4 10h16", person: "M12 4a4 4 0 0 0-4 4",
  document: "M15 3v5h4", shield: "M12 3 5 6", scan: "M5 5V3h4", signature: "M4 17c2-4 4-5 6-3",
  warning: "M12 14v2", legal: "M12 15v2", chart: "M8 16v-4", guarantee: "M12 8v8", bill: "M6 4h12",
  receipt: "M8 7h8", calendar: "M8 4v6", transfer: "M9 12h6", search: "M18 13a4 4 0 1 0 0 .01",
  id: "M8 9h4", pin: "M12 6a3 3 0 1 0 0 6", package: "M3 7h13", gauge: "M12 12l5-4",
  car: "M6 9l2-4h8", road: "M12 5v14", license: "M9 7h6", plate: "M6 11h2", history: "M12 3v3",
  check: "M14 14l2 2", serial: "M8 8h8", chain: "M8 8h5", searchdoc: "M16 15a2 2 0 1 0 0 .01",
  accept: "M8 16l2 2", cancel: "M9 15l5 5", people: "M9 4a3 3 0 1 0 0 6", building: "M4 5h10",
  seal: "M12 3 5 6",
};

export function ServiceIcon({ serviceId, size = 48, className, ...props }: IconProps) {
  const icon = iconPaths[serviceId as IconName];

  if (!icon) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d={icon.main} stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
      <path d={icon.detail} stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
      <path d={accentByKind[icon.kind]} stroke="var(--service-icon-accent, #1685E8)" strokeWidth="2.15" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="4" r="1.15" fill="var(--service-icon-accent, #1685E8)" opacity=".8" />
    </svg>
  );
}

export function getServiceIconIds() {
  return Object.keys(iconPaths);
}
