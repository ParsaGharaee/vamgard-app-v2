"use client";
import type { FinnotechService } from "@/src/lib/finnotech/types";
import { getCompositeById } from "@/src/lib/finnotech/composites";
import GenericInquiryFlow from "./GenericInquiryFlow";
import SmsAuthInquiryFlow from "./SmsAuthInquiryFlow";
import CompositeFlow from "./CompositeFlow";

export default function ServiceFlowRouter({ service }: { service: FinnotechService }) {
  const composite = getCompositeById(service.id);
  if (composite || service.operationId.startsWith("composite:")) {
    const def = composite || getCompositeById(service.id.replace(/^composite:/, ""));
    if (def) return <CompositeFlow def={def} />;
  }

  if (service.grantType === "authorization_sms" || service.flow === "otp") {
    return <SmsAuthInquiryFlow service={service} />;
  }

  return <GenericInquiryFlow service={service} />;
}
