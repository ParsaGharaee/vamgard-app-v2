"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

/** هدر صفحه‌های داخلی سرویس‌ها (عنوان راست، دکمه بازگشت چپ) */
export function ServiceHeader({ title }: { title: string }) {
  const router = useRouter();
  return (
    <div className="mx-5 pt-6 pb-2 flex items-center justify-between">
      <h1 className="text-xl font-extrabold">{title}</h1>
      <button onClick={() => router.back()} aria-label="بازگشت" className="surface grid h-10 w-10 place-items-center rounded-full text-silver">
        <ChevronLeft size={22} />
      </button>
    </div>
  );
}
