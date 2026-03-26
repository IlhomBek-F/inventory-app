import type {
  DashboardResponseType,
  ListShoesResponseType,
  OrderBodyType,
  OrderListResponseType,
  OrderResponseType,
  ReportsResponseType,
  ShoeBodyType,
  ShoeResponseType,
  ShoeUpdateBodyType,
  StockMovementBodyType,
  StockMovementListItemType,
  StockMovementResponseType,
} from "@inventory/shared/types";
import { env } from "./env";

const BASE_URL = env.VITE_SERVER_URL;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed: ${res.status}`);
  }

  return res.json();
}

// Re-export types for convenience
export type Shoe = ShoeResponseType;
export type ListShoesResponse = ListShoesResponseType;
export type DashboardData = DashboardResponseType;
export type ReportsData = ReportsResponseType;
export type StockMovement = StockMovementListItemType;
export type StockMovementResult = StockMovementResponseType;
export type Order = OrderResponseType;
export type OrderListResponse = OrderListResponseType;
export type OrderBody = OrderBodyType;

// ── API ──

export const api = {
  shoes: {
    list(params?: { search?: string; sortBy?: string; sortOrder?: "asc" | "desc" }) {
      const query = new URLSearchParams();
      if (params?.search) query.set("search", params.search);
      if (params?.sortBy) query.set("sortBy", params.sortBy);
      if (params?.sortOrder) query.set("sortOrder", params.sortOrder);
      const qs = query.toString();
      return request<ListShoesResponseType>(`/shoes${qs ? `?${qs}` : ""}`);
    },

    get(id: string) {
      return request<ShoeResponseType>(`/shoes/${encodeURIComponent(id)}`);
    },

    create(data: ShoeBodyType) {
      return request<ShoeResponseType>("/shoes", { method: "POST", body: JSON.stringify(data) });
    },

    update(id: string, data: ShoeUpdateBodyType) {
      return request<ShoeResponseType>(`/shoes/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    delete(id: string) {
      return request<{ success: boolean }>(`/shoes/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    },

    addMovement(id: string, data: StockMovementBodyType) {
      return request<StockMovementResponseType>(`/shoes/${encodeURIComponent(id)}/movements`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    getMovements(id: string) {
      return request<StockMovementListItemType[]>(`/shoes/${encodeURIComponent(id)}/movements`);
    },
  },

  reports: {
    get() {
      return request<ReportsResponseType>("/shoes/reports");
    },
  },

  dashboard: {
    get() {
      return request<DashboardResponseType>("/shoes/dashboard");
    },
  },

  orders: {
    list() {
      return request<OrderListResponseType>("/orders");
    },

    get(id: string) {
      return request<OrderResponseType>(`/orders/${encodeURIComponent(id)}`);
    },

    create(data: OrderBodyType) {
      return request<OrderResponseType>("/orders", { method: "POST", body: JSON.stringify(data) });
    },
  },
};
