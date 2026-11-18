import { RefreshCcw } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export const VamButton = ({ loading, children, className, ...props }: Props) => (
  <button
    disabled={loading || props.disabled}
    className={`w-full bg-brand text-white rounded-2xl py-3.5 text-sm font-extrabold active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center gap-2 mt-2 shadow-[0_8px_20px_rgb(8_123_255_/_0.35)] ${className || ""}`}
    {...props}
  >
    {loading ? <RefreshCcw size={18} className="animate-spin" /> : children}
  </button>
);
