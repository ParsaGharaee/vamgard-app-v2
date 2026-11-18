import { notFound } from "next/navigation";
import { loans } from "@/src/components/loans/data";
import { LoanDetailScreen } from "@/src/components/loans/detail/LoanDetailScreen";

export function generateStaticParams() {
  return loans.map((l) => ({ id: l.id }));
}

export default async function LoanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const loan = loans.find((l) => l.id === id);
  if (!loan) notFound();
  return <LoanDetailScreen loan={loan} />;
}