export const VamInput = ({ label, icon: Icon, ...props }: any) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-silver mb-1.5 pr-1">{label}</label>
    <div className="relative">
      <input className="w-full surface rounded-xl py-3.5 pr-11 pl-4 text-sm outline-none placeholder:text-silver/50 focus:ring-2 focus:ring-brand/50 transition-all font-sans text-left" dir="ltr" {...props} />
      {Icon && <Icon size={20} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-silver/80" />}
    </div>
  </div>
);
