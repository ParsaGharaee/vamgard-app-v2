import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  title: "وام‌گرد",
  description: "خدمات مالی و وام",
};

const themeScript = `
  try {
    var theme = localStorage.getItem("theme");

    if (theme === "light" || theme === "dark") {
      document.documentElement.dataset.theme = theme;
    }
  } catch (error) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>

      <body
        className={`${vazir.variable} font-sans min-h-screen bg-background text-ink`}
      >
        <div className="mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden sm:shadow-[0_0_60px_rgba(8,123,255,0.16)]">
          {children}
        </div>
      </body>
    </html>
  );
}