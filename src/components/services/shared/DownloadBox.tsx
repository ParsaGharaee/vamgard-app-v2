import { Download, FileText, Video } from "lucide-react";

export const DownloadBox = ({ title, type, url }: { title: string; type: "pdf" | "video"; url?: string }) => (
  <a href={url || "#"} className="surface flex items-center justify-between rounded-2xl p-3 text-sm font-bold mt-2">
    <div className="flex items-center gap-2">
      {type === "pdf" ? <FileText size={20} className="text-red-500" /> : <Video size={20} className="text-brand" />}
      {title}
    </div>
    <span className="flex items-center gap-1 text-[10px] text-brand bg-brand/10 px-2 py-1.5 rounded-lg">
      <Download size={14} /> کلیک برای دانلود
    </span>
  </a>
);
