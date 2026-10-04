import { useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, MessageSquarePlus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Footer } from "@/components/Footer";
import { RegionSwitch } from "@/components/RegionSwitch";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/report", label: "Report a Bloom", end: false },
  { to: "/oah-cities", label: "OAH Cities", end: false },
  { to: "/methodology", label: "Methodology", end: false },
];

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const onReportPage = useLocation().pathname.startsWith("/report");
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-[60px] max-w-[1360px] items-center gap-3 px-4 md:gap-8 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu strokeWidth={1.75} />
          </Button>
          <NavLink to="/" className="text-xl font-bold tracking-[-0.01em] text-foreground">
            Verdant
          </NavLink>
          <nav aria-label="Main" className="hidden h-full items-stretch gap-6 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    "-mb-px flex items-center border-b-2 text-sm font-medium transition-colors duration-[120ms]",
                    isActive
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3 md:gap-4">
            {!onReportPage && (
              <Link to="/report" className={cn(buttonVariants(), "hidden h-9 px-3 md:inline-flex")}>
                <MessageSquarePlus strokeWidth={1.75} aria-hidden />
                Report what you see
              </Link>
            )}
            <RegionSwitch />
          </div>
        </div>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="gap-0 p-0">
          <SheetTitle className="border-b border-border px-4 py-4 text-xl font-bold">Verdant</SheetTitle>
          <nav aria-label="Main" className="flex flex-col">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "border-b border-l-2 border-b-border px-4 py-3 text-sm font-medium",
                    isActive ? "border-l-primary text-foreground" : "border-l-transparent text-muted-foreground",
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <main className="mx-auto w-full max-w-[1360px] flex-1 px-4 md:px-6">{children}</main>
      <Footer />
    </div>
  );
}
