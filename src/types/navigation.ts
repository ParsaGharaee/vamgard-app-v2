export type Tab = "home" | "services" | "loans" | "group" | "profile";

/** props مشترک همه‌ی صفحه‌های تب‌دار */
export type ScreenProps = { go: (tab: Tab) => void };
