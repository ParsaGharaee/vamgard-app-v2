
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { serviceFilters, serviceTopics } from "./data";
import { ScreenProps } from "@/src/types/navigation";
import { TitleBar } from "../layout/TitleBar";
import { MarqueeText } from "../ui";

// مسیر آیکون دسته‌بندی‌ها
function getTopicIcon(topicId: string): string {
  const fileName = topicId === "همه" ? "all" : topicId;

  return `/icons-new/topics/${fileName}.png`;
}

// اصلاح نام فایل‌هایی که با ID سرویس متفاوت هستند
const SERVICE_ICON_ALIASES: Record<string, string> = {
  "sayad-transfers-chain": "sayad-transfer-chain",
};

// مسیر آیکون تک‌تک سرویس‌ها
function getServiceIcon(serviceId: string): string {
  const fileName =
    SERVICE_ICON_ALIASES[serviceId] ?? serviceId;

  return `/icons-new/services/${fileName}.png`;
}

// کوتاه‌سازی نام دسته‌بندی‌ها
function getOneWordLabel(label: string): string {
  const clean = label.trim();

  if (clean === "همه") return "همه";

  if (
    clean.includes("بانک") ||
    clean.includes("کارت") ||
    clean.includes("شبا")
  ) return "بانکی";

  if (
    clean.includes("چک") ||
    clean.includes("صیاد")
  ) return "چک";

  if (
    clean.includes("خودرو") ||
    clean.includes("پلاک") ||
    clean.includes("خلافی")
  ) return "خودرو";

  if (
    clean.includes("هویت") ||
    clean.includes("احراز") ||
    clean.includes("ملی")
  ) return "هویتی";

  if (
    clean.includes("اعتبار") ||
    clean.includes("تسهیلات") ||
    clean.includes("وام")
  ) return "اعتبار";

  if (
    clean.includes("قبض") ||
    clean.includes("قبوض")
  ) return "قبوض";

  if (
    clean.includes("پست") ||
    clean.includes("آدرس")
  ) return "پستی";

  if (
    clean.includes("شرکت") ||
    clean.includes("حقوقی")
  ) return "حقوقی";

  const stripped = clean
    .replace(
      /^(سرویس‌های|سرویس های|سرویس|خدمات|استعلامات|استعلام|امور)\s+/g,
      ""
    )
    .trim();

  return stripped.split(/\s+/)[0] || clean;
}

export function ServicesScreen({ go }: ScreenProps) {
  const [activeFilter, setActiveFilter] = useState<string>("همه");

  const rootRef = useRef<HTMLDivElement | null>(null);
  const filterBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scroller = rootRef.current?.closest("main");
    const bar = filterBarRef.current;

    if (!scroller || !bar) return;

    let compact = false;
    let rafId = 0;

    const onScroll = () => {
      cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const y = scroller.scrollTop;

        if (!compact && y > 44) {
          compact = true;
          bar.dataset.compact = "true";
        } else if (compact && y < 14) {
          compact = false;
          bar.dataset.compact = "false";
        }
      });
    };

    scroller.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      cancelAnimationFrame(rafId);

      scroller.removeEventListener("scroll", onScroll);
    };
  }, []);

  // فیلتر دسته‌بندی‌ها
  const filteredTopics = serviceTopics.filter(
    (topic) =>
      activeFilter === "همه" ||
      topic.id === activeFilter
  );

  return (
    <div
      ref={rootRef}
      className="animate-in fade-in duration-300 pb-10"
    >
      <TitleBar title="خدمات" go={go} />

      {/* نوار دسته‌بندی‌ها */}
      <div
        ref={filterBarRef}
        data-compact="false"
        className="group sticky top-0 z-20 h-[54px] overflow-visible"
      >
        <div className="border-b border-line/10 bg-bg/95 py-2 backdrop-blur-md">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-4">

            {serviceFilters.map((f) => {
              const active = activeFilter === f.id;
              const shortLabel = getOneWordLabel(f.label);

              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`
                    shrink-0
                    flex
                    w-[72px]
                    h-[72px]
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    transition-[height,border-radius]
                    duration-200
                    ease-out
                    group-data-[compact=true]:h-9
                    group-data-[compact=true]:rounded-xl
                    ${
                      active
                        ? "bg-brand text-white"
                        : "surface text-ink"
                    }
                  `}
                >
                  {/* آیکون دسته‌بندی */}
                  <div
                    className="
                      mb-1
                      grid
                      h-7
                      w-7
                      shrink-0
                      place-items-center
                      overflow-hidden
                      transition-[height,margin,opacity,transform]
                      duration-200
                      ease-out
                      group-data-[compact=true]:mb-0
                      group-data-[compact=true]:h-0
                      group-data-[compact=true]:scale-75
                      group-data-[compact=true]:opacity-0
                    "
                  >
                    <Image
                      src={getTopicIcon(f.id)}
                      alt={shortLabel}
                      width={28}
                      height={28}
                      sizes="28px"
                      className="h-7 w-7 object-contain"
                    />
                  </div>

                  {/* عنوان دسته‌بندی */}
                  <span className="w-full truncate px-1 text-center text-[11px] font-bold leading-4">
                    {shortLabel}
                  </span>
                </button>
              );
            })}

          </div>
        </div>
      </div>

      {/* فضای جبرانی نوار دسته‌بندی */}
      <div className="h-[36px]" />

      {/* لیست دسته‌بندی‌ها و سرویس‌ها */}
      <div className="mt-1">

        {filteredTopics.map((topic, i) => (
          <section
            key={topic.id}
            className="mx-4 mt-5 scroll-mt-20"
          >
            {/* عنوان دسته‌بندی */}
            <h2 className="mb-4 flex items-center gap-2.5 text-[14px] font-extrabold">

              <span className="h-4 w-1 shrink-0 rounded-full bg-brand" />

              <span>{topic.title}</span>

              <span className="mr-auto text-[10px] font-semibold text-silver">
                {topic.services.length} سرویس
              </span>

            </h2>

            {/* کارت‌های سرویس */}
            <div className="grid grid-cols-4 gap-3.5">

              {topic.services.map((srv) => (
                <Link
                  key={srv.id}
                  href={srv.href}
                  className="
                    surface
                    group
                    relative
                    flex
                    aspect-square
                    min-w-0
                    flex-col
                    items-center
                    justify-center
                    gap-1.5
                    rounded-[10px]
                    px-1.5
                    transition-all
                    duration-200
                    hover:border-brand/30
                    active:scale-[0.96]
                  "
                >
                  {/* آیکون اختصاصی سرویس */}
                  <div
                    className="
                      relative
                      grid
                      h-10
                      w-10
                      shrink-0
                      place-items-center
                      transition-transform
                      duration-200
                      group-hover:-translate-y-0.5
                    "
                  >
                    <Image
                      src={getServiceIcon(srv.id)}
                      alt={srv.t}
                      width={40}
                      height={40}
                      sizes="40px"
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* عنوان سرویس */}
                  <div
                    className="
                      flex
                      w-full
                      min-w-0
                      justify-center
                      overflow-hidden
                      [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]
                      [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]
                    "
                  >
                    <MarqueeText className="text-center text-[10px] font-bold leading-5">
                      {srv.t}
                    </MarqueeText>
                  </div>

                </Link>
              ))}

            </div>

            {/* جداکننده دسته‌بندی‌ها */}
            {i !== filteredTopics.length - 1 && (
              <div className="mt-7 h-px w-full bg-line/10" />
            )}

          </section>
        ))}

      </div>
    </div>
  );
}
