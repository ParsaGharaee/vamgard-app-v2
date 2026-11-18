"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { serviceFilters, serviceTopics } from "./data";
import { ScreenProps } from "@/src/types/navigation";
import { TitleBar } from "../layout/TitleBar";
import { Ic, MarqueeText } from "../ui";

export function ServicesScreen({ go }: ScreenProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("همه");
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const filteredTopics = serviceTopics
    .filter((topic) => activeFilter === "همه" || topic.id === activeFilter)
    .map((topic) => ({ ...topic, services: topic.services.filter((s) => s.t.includes(search)) }))
    .filter((topic) => topic.services.length > 0);

  return (
    <div className="animate-in fade-in duration-300 pb-10">
      <TitleBar title="خدمات" go={go} />

      {/* سرچ و فیلتر چسبان */}
      <div className="sticky top-0 z-30 bg-bg/90 backdrop-blur-md px-4 py-3 border-b border-line/5 shadow-sm mt-3">
        <div className="relative">
          <input
            type="text"
            placeholder="جستجوی خدمات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full surface rounded-2xl py-3.5 pr-12 pl-4 text-sm outline-none placeholder:text-silver/70 focus:ring-2 focus:ring-brand/50 transition-shadow"
          />
          <Search size={22} className="absolute right-4 top-1/2 -translate-y-1/2 text-silver" />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {serviceFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => { setActiveFilter(f.id); setSearch(""); }}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                activeFilter === f.id ? "bg-brand text-white shadow-md" : "surface text-silver"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* لیست تاپیک‌ها */}
      <div className="mt-2">
        {filteredTopics.map((topic, i) => (
          <div key={topic.title} className="mx-4 mt-6 scroll-mt-32" ref={(el) => { sectionRefs.current[topic.id] = el; }}>
            <h2 className="flex items-center gap-2 text-[15px] font-extrabold mb-3">
              <span className="h-3.5 w-1 rounded-full bg-brand" />
              {topic.title}
            </h2>

            <div className="grid grid-cols-4 gap-2.5">
              {topic.services.map((srv) => (
                <Link
                  key={srv.id}
                  href={srv.href}
                  className="surface group flex h-[88px] relative flex-col items-center justify-center gap-2 rounded-2xl px-2 active:scale-95 transition-transform"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full transition-colors group-active:bg-brand/20">
                    <Ic n={srv.ic} size={24} className="invert-0 brightness-115" />
                  </span>
                  <div className="w-full overflow-hidden flex justify-center [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
                    <MarqueeText className="text-[11px] font-bold">{srv.t}</MarqueeText>
                  </div>
                </Link>
              ))}
            </div>
            {i !== filteredTopics.length - 1 && <div className="h-px w-full bg-line/5 mt-6" />}
          </div>
        ))}
      </div>
    </div>
  );
}
