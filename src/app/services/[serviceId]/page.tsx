import { notFound } from "next/navigation";
import ServiceFlowRouter from "@/src/components/services/engine/ServiceFlowRouter";
import { getServiceById, getListableServices } from "@/src/lib/finnotech/catalog";
import { getServiceById as getGenerated } from "@/src/lib/finnotech/catalog.generated";

type Props = { params: { serviceId: string } };

export const dynamicParams = true;

export function generateStaticParams() {
  return getListableServices().map((s) => ({ serviceId: s.id }));
}

export default function ServicePage({ params }: Props) {
  const service =
    getServiceById(params.serviceId) || getGenerated(params.serviceId);
  if (!service) notFound();
  return <ServiceFlowRouter service={service} />;
}
