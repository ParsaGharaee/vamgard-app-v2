import { ProfileSubpage } from "@/src/components/profile/ProfileSubpage";
import { accountMenu } from "@/src/components/profile/data";

export function generateStaticParams() {
  const fromMenu = accountMenu
    .map((x) => x.href.replace(/^\/profile\//, ""))
    .filter((s) => s && !s.includes("/"));
  const extra = ["wallet", "credit", "history", "support", "personal"];
  return [...new Set([...fromMenu, ...extra])].map((section) => ({ section }));
}

export default async function ProfileSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  return <ProfileSubpage section={section} />;
}
