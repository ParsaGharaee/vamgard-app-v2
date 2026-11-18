import type { IconKey } from "@/src/lib/constants/icons";
import {
  getListableByCategory,
  getListableServices,
  serviceCategories,
  serviceFilters as finnotechFilters,
} from "@/src/lib/finnotech/catalog";

export type ServiceItem = { id: string; t: string; ic: IconKey; href: string };
export type ServiceTopic = {
  id: string;
  title: string;
  services: ServiceItem[];
};

export const serviceTopics: ServiceTopic[] = serviceCategories.map((cat) => ({
  id: cat.id,
  title: cat.title,
  services: getListableByCategory(cat.id).map((s) => ({
    id: s.id,
    t: s.title,
    ic: s.icon,
    href: `/services/${s.id}`,
  })),
}));

export const serviceFilters = finnotechFilters;

export function findServiceItem(id: string): ServiceItem | undefined {
  return getListableServices()
    .map((s) => ({
      id: s.id,
      t: s.title,
      ic: s.icon,
      href: `/services/${s.id}`,
    }))
    .find((s) => s.id === id);
}
