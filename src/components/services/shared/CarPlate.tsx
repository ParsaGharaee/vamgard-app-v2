"use client";
import { fa } from "@/src/lib/format";

export const CarPlate = ({
  p1,
  letter,
  p2,
  code,
}: {
  p1: string;
  letter: string;
  p2: string;
  code: string;
}) => (
  <div className="flex justify-center my-3">
    <div
      dir="ltr"
      className="flex h-[52px] w-[240px] overflow-hidden rounded-xl border-2 border-zinc-900 bg-white text-zinc-900 shadow-md select-none"
    >
      {/* نوار آبی سمت چپ همراه با پرچم ایران */}
      <div className="flex w-9 shrink-0 flex-col items-center justify-between bg-[#003399] py-1.5 text-white border-r-2 border-zinc-900">
        <div className="flex h-2.5 w-5 flex-col overflow-hidden rounded-[1.5px] ring-1 ring-white/25">
          <span className="flex-1 bg-[#239F40]" />
          <span className="flex-1 bg-white" />
          <span className="flex-1 bg-[#DA0000]" />
        </div>
        <div className="flex flex-col items-center leading-none">
          <span className="text-[6.5px] font-bold tracking-wider opacity-90">I.R.</span>
          <span className="text-[7.5px] font-black tracking-tight mt-0.5">IRAN</span>
        </div>
      </div>

      {/* اعداد و حرف پلاک */}
      <div className="flex flex-1 items-center justify-center gap-2.5 text-xl font-black tracking-wide">
        <span>{fa(p1)}</span>
        <span className="text-lg">{letter}</span>
        <span>{fa(p2)}</span>
      </div>

      {/* کد ایران سمت راست */}
      <div className="flex w-[52px] shrink-0 flex-col items-center justify-center border-l-2 border-zinc-900 bg-zinc-50 px-1">
        <span className="text-[9px] font-extrabold text-zinc-500 leading-none">ایران</span>
        <span className="text-lg font-black leading-none mt-1">{fa(code)}</span>
      </div>
    </div>
  </div>
);