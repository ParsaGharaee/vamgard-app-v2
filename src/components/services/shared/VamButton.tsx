import { RefreshCcw } from "lucide-react";

export const VamButton = ({ loading, children, ...props }: any) => (
  <button disabled={loading} className="w-full bg-brand text-white rounded-xl py-3.5 text-sm font-bold active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center gap-2 mt-2" {...props}>
    {loading ? <RefreshCcw size={18} className="animate-spin" /> : children}
  </button>
);
