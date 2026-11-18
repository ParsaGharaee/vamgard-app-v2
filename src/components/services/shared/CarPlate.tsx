import { fa } from "@/src/lib/format";

export const CarPlate = ({ p1, letter, p2, code }: { p1: string; letter: string; p2: string; code: string }) => (
  <div className="flex justify-center my-3">
    <div className="flex h-11 w-[200px] overflow-hidden rounded-md border-[2.5px] border-black bg-white text-black drop-shadow-sm font-extrabold">
      <div className="flex w-8 flex-col items-center justify-center border-r-[2.5px] border-black bg-blue-700 text-white">
        <span className="text-[8px] font-sans">I.R.</span>
        <span className="text-[10px] font-sans">IRAN</span>
      </div>
      <div className="flex flex-1 items-center justify-center gap-2 text-xl pt-1">
        <span>{fa(p1)}</span><span>{letter}</span><span>{fa(p2)}</span>
      </div>
      <div className="flex w-12 flex-col items-center justify-center border-l-[2.5px] border-black text-sm">
        <span className="text-[10px] text-gray-600 mb-0.5">ایران</span>
        <span className="text-lg leading-none">{fa(code)}</span>
      </div>
    </div>
  </div>
);
