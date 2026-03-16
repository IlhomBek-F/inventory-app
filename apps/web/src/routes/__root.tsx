import { HeadContent, Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Button } from "@/components/ui/button";
import { Warehouse, LayoutDashboard, Package, LogIn, UserPlus } from "lucide-react";

import "../index.css";

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "inventory-app",
      },
      {
        name: "description",
        content: "Shoe inventory management application",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <div className="min-h-screen flex flex-col">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-12 items-center px-4 gap-6">
            <Link to="/" className="flex items-center gap-2 font-semibold text-sm">
              <Warehouse className="size-4" />
              ShoeStock
            </Link>
            <nav className="flex items-center gap-1">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="size-3.5" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/shoes">
                <Button variant="ghost" size="sm">
                  <Package className="size-3.5" />
                  Shoes
                </Button>
              </Link>
            </nav>
            <div className="ml-auto flex items-center gap-1">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="size-3.5" />
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  <UserPlus className="size-3.5" />
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
}
