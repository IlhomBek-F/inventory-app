import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { BarChart3, History, Loader2, Package, Warehouse } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

    if (session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: AuthLayout,
  pendingComponent: AuthPending,
});

function AuthPending() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary/10 via-primary/5 to-background flex-col justify-between p-10">
        <div>
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Warehouse className="size-6" />
            ShoeStock
          </Link>
          <div className="mt-16">
            <h1 className="text-3xl font-bold tracking-tight">Manage your shoe inventory</h1>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Track stock, monitor movements, and grow your business with ShoeStock.
            </p>
          </div>
          <div className="mt-10 grid gap-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-center size-8 rounded-md bg-primary/10">
                <Package className="size-4 text-primary" />
              </div>
              Track inventory across sizes, brands & locations
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-center size-8 rounded-md bg-primary/10">
                <BarChart3 className="size-4 text-primary" />
              </div>
              Real-time dashboard with stock analytics
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-center size-8 rounded-md bg-primary/10">
                <History className="size-4 text-primary" />
              </div>
              Full audit trail of every stock movement
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">&copy; 2026 ShoeStock. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-6 lg:hidden">
            <Warehouse className="size-8 text-primary mb-2" />
            <span className="font-bold text-lg">ShoeStock</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
