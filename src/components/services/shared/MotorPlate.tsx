import { fa } from "@/src/lib/format";

export const MotorPlate = ({ top, bottom }: { top: string; bottom: string }) => (
  <div className="flex justify-center my-3">
    <div className="flex flex-col h-16 w-24 items-center justify-center rounded-md border-[2.5px] border-black bg-white text-black drop-shadow-sm font-extrabold text-xl pt-1">
      <span className="tracking-widest">{fa(top)}</span>
      <span className="tracking-widest">{fa(bottom)}</span>
    </div>
  </div>
);
