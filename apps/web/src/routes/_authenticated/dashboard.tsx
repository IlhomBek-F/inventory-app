import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { DashboardStats } from "./-components/dashboard-stats";
import { LowStockList } from "./-components/low-stock-list";
import { RecentMovementsList } from "./-components/recent-movements-list";

export const Route = createFileRoute("/_authenticated/dashboard")({
  loader: () => api.dashboard.get(),
  component: DashboardPage,
});

function DashboardPage() {
  const { stats, lowStock, recentMovements } = Route.useLoaderData();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">{t("dashboard.title")}</h1>
        <Link to="/shoes/new">
          <Button size="sm">
            <Plus className="size-3.5" />
            {t("dashboard.addShoe")}
          </Button>
        </Link>
      </div>

      <DashboardStats
        totalModels={stats.totalModels}
        totalUnits={stats.totalUnits}
        inventoryValue={stats.inventoryValue}
        lowStockCount={stats.lowStockCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <LowStockList items={lowStock} />
        <RecentMovementsList movements={recentMovements} />
      </div>
    </div>
  );
}
