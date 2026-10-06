"use client";

import type { ComponentProps } from "react";
import { Link, usePathname } from "@/lib/i18n/navigation";
import type { Pathname, StaticPathname } from "@/lib/i18n/routing";
import { cn } from "@/lib/cn";

type Props = Omit<ComponentProps<typeof Link>, "href" | "className"> & {
  href: StaticPathname;
  match?: Pathname[];
  className?: string;
  activeClassName?: string;
};

/** Link do menu com aria-current="page" quando a rota atual corresponde. */
export function NavLink({ href, match, className, activeClassName, children, ...rest }: Props) {
  const pathname = usePathname();
  const active = (match ?? [href]).includes(pathname as Pathname);
  return (
    <Link
      href={href as never}
      aria-current={active ? "page" : undefined}
      className={cn(className, active && activeClassName)}
      {...rest}
    >
      {children}
    </Link>
  );
}
