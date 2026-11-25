
"use client";

import { Camera, UserRound } from "lucide-react";
import { LottieSlot } from "../ui";

export function ProfileAvatar({
  className = "",
  active = true,
}: {
  className?: string;
  active?: boolean;
}) {
  return (
    <div
      className={`
        relative h-28 w-28 shrink-0
        overflow-visible rounded-full
        ${className}
      `}
    >
      {/* Avatar Circle */}
      <div className="
        absolute inset-0
         rounded-full
        border-[4px] border-[#DCE5EF]
        bg-[#D9E1EA]
      ">
        {/* Enlarge actual Lottie content */}
        <div className="
          absolute inset-0
          flex items-center justify-center
          scale-[2] -mt-3.5
        ">
          <LottieSlot
            key={active ? "avatar-active" : "avatar-inactive"}
            name="profile-avatar"
            size={112}
            play={active}
            fallback={
              <UserRound
                size={65}
                className="text-slate-500"
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
