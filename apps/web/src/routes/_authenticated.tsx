import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Loader2, LogOut, Package, User, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

    if (!session) {
      throw redirect({ to: "/login" });
    }

    return { session };
  },
  component: AuthenticatedLayout,
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

function AuthenticatedLayout() {
  const { session } = Route.useRouteContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
        <div className="flex h-12 items-center justify-between px-4 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2 font-bold text-sm">
              <Warehouse className="size-4" />
              ShoeStock
            </Link>
            <nav className="flex items-center gap-1">
              <Link to="/dashboard">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 text-xs"
                  >
                    <LayoutDashboard className="size-3.5" />
                    Dashboard
                  </Button>
                )}
              </Link>
              <Link to="/shoes">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 text-xs"
                  >
                    <Package className="size-3.5" />
                    Inventory
                  </Button>
                )}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center justify-center size-7 rounded-full bg-primary/10">
                <User className="size-3.5 text-primary" />
              </div>
              <span className="text-xs font-medium hidden sm:inline">
                {session.user.name || session.user.email}
              </span>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleSignOut}>
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
