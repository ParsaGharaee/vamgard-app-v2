"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

/** هدر صفحه‌های داخلی سرویس‌ها (عنوان راست، دکمه بازگشت چپ) */
export function ServiceHeader({
  title,
  fallbackHref = "/?tab=services",
}: {
  title: string;
  fallbackHref?: string;
}) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <div className="mx-5 flex items-center justify-between pt-6 pb-2">
      <h1 className="text-xl font-extrabold">{title}</h1>
      <button
        onClick={handleBack}
        aria-label="بازگشت"
        className="surface grid h-10 w-10 place-items-center rounded-full text-silver"
      >
        <ChevronLeft size={22} />
      </button>
    </div>
  );
}