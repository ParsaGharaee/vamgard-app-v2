"use client";

import { useEffect, useState } from "react";
import { UserCheck } from "lucide-react";
import { AppUser, loadSession, useSessionListener } from "@/src/lib/session";

type Props = {
  onFill: (user: AppUser) => void;
  label?: string;
};

export function FillFromProfileButton({ onFill, label = "پر کردن با اطلاعات خودم" }: Props) {
  const [user, setUser] = useState<AppUser>({ loggedIn: false });

  useEffect(() => {
    setUser(loadSession());
    return useSessionListener(() => setUser(loadSession()));
  }, []);

  if (!user.loggedIn || (!user.nationalCode && !user.mobile)) return null;

  return (
    <button
      type="button"
      onClick={() => onFill(user)}
      className="mb-4 inline-flex items-center gap-1.5 rounded-xl border border-brand/25 bg-brand/10 px-3 py-1.5 text-[11px] font-extrabold text-brand active:scale-95 transition-transform"
    >
      <UserCheck size={14} />
      <span>{label}</span>
    </button>
  );
}