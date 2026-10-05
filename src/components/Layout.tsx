import { useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, MessageSquarePlus, Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { InkUnderline } from "@/components/FieldMarks";
import { Footer } from "@/components/Footer";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { RegionSwitch, nextCities } from "@/components/RegionSwitch";
import { COMMON } from "@/i18n/common";
import { useStrings } from "@/state/LanguageContext";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", key: "navDashboard", end: true },
  { to: "/report", key: "navReport", end: false },
  { to: "/my-reports", key: "navMyReports", end: false },
  { to: "/rangers", key: "navQueue", end: false },
  { to: "/oah-cities", key: "navCities", end: false },
  { to: "/methodology", key: "navMethodology", end: false },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const s = useStrings(COMMON);
  const onReportPage = useLocation().pathname.startsWith("/report");
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-[60px] max-w-[1360px] items-center gap-2 px-3 sm:gap-3 sm:px-4 md:px-6 xl:gap-8">
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            aria-label={s.openNavigation}
            onClick={() => setOpen(true)}
          >
            <Menu strokeWidth={1.75} />
          </Button>
          <NavLink to="/" className="font-heading text-2xl leading-none tracking-[-0.01em] text-foreground">
            Verdant
          </NavLink>
          <nav aria-label="Main" className="hidden h-full items-stretch gap-5 xl:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center text-sm font-medium whitespace-nowrap transition-colors duration-[120ms]",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {({ isActive }) =>
                  isActive ? <InkUnderline tone="primary">{s[n.key]}</InkUnderline> : s[n.key]
                }
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2 md:gap-3">
            {!onReportPage && (
              <Link
                to="/report"
                aria-label={s.reportCta}
                title={s.reportCta}
                className={cn(buttonVariants(), "hidden size-9 px-0 whitespace-nowrap md:inline-flex 2xl:w-auto 2xl:px-3")}
              >
                <MessageSquarePlus strokeWidth={1.75} aria-hidden />
                <span className="hidden 2xl:inline">{s.reportCta}</span>
              </Link>
            )}
            <RegionSwitch />
            <LanguageSwitch />
          </div>
        </div>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="gap-0 p-0">
          <SheetTitle className="border-b border-border px-4 py-4 font-heading text-2xl font-normal">Verdant</SheetTitle>
          <Link
            to="/oah-cities"
            onClick={() => setOpen(false)}
            className="m-4 flex flex-col gap-1 rounded-sm border border-dashed border-input px-3 py-2.5 text-sm font-medium text-muted-foreground"
          >
            <span className="flex items-center gap-1">
              <Plus className="size-3.5" strokeWidth={1.75} aria-hidden />
              {s.moreCitiesFull}
            </span>
            <span className="font-mono text-xs">{nextCities().join(", ")}</span>
          </Link>
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
                {s[n.key]}
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <main className="mx-auto w-full max-w-[1360px] flex-1 px-4 pt-8 pb-16 md:px-6">{children}</main>
      <Footer />
    </div>
  );
}
