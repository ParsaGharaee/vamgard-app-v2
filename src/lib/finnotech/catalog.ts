import {
  finnotechServices as generated,
  serviceCategories as generatedCategories,
  getServiceById as generatedGet,
} from "./catalog.generated";
import {
  COMPOSITE_DEFS,
  COMPOSITE_HIDDEN_STEPS,
  compositeAsListItem,
  getCompositeById,
} from "./composites";
import { faServiceTitle } from "./fa";
import type { FinnotechService, ServiceCategory } from "./types";

const EXTRA_HIDDEN = new Set([
  "sign-digital-sign-otp-request-post",
  "sign-digital-sign-enroll-post",
  // keep enroll hidden only when composite covers it — composite hides both
]);

function withListable(s: FinnotechService): FinnotechService {
  const hidden =
    COMPOSITE_HIDDEN_STEPS.has(s.id) || EXTRA_HIDDEN.has(s.id);
  return {
    ...s,
    title: faServiceTitle(s.title),
    listable: s.listable ?? !hidden,
  };
}

export const serviceCategories: ServiceCategory[] = generatedCategories;

const COMPOSITE_ITEMS = COMPOSITE_DEFS.map(compositeAsListItem);

export const finnotechServices: FinnotechService[] = [
  ...COMPOSITE_ITEMS,
  ...generated.map(withListable).filter((s) => !COMPOSITE_HIDDEN_STEPS.has(s.id)),
];

export function getServiceById(id: string): FinnotechService | undefined {
  const composite = getCompositeById(id);
  if (composite) return compositeAsListItem(composite);
  const found = generatedGet(id) || finnotechServices.find((s) => s.id === id);
  return found ? { ...found, title: faServiceTitle(found.title) } : undefined;
}

export function getListableServices(): FinnotechService[] {
  return finnotechServices.filter((s) => s.listable !== false);
}

export function getListableByCategory(categoryId: string): FinnotechService[] {
  return getListableServices().filter((s) => s.category === categoryId);
}

const FILTER_LABELS: Record<string, string> = {
  kyc: "احراز هویت",
  inquiry: "بانکی",
  account: "حساب",
  sayad: "چک صیادی",
  credit: "اعتبار",
  kyb: "کسب‌وکار",
  vehicle: "خودرو",
  billing: "قبض",
  postal: "کدپستی",
  sms: "پیامک",
  signature: "امضا",
  promissory: "سفته",
  device: "دستگاه",
};

export const serviceFilters = [
  { id: "همه", label: "همه خدمات" },
  ...serviceCategories.map((c) => ({
    id: c.id,
    label: FILTER_LABELS[c.id] || c.title,
  })),
];
