import type { CSSProperties, PropsWithChildren } from "react";
import { Link } from "wouter";

type CycleLinkProps = {
  href: string;
  disabled: boolean;
};
export function CycleLink({
  href,
  disabled,
  children,
}: PropsWithChildren<CycleLinkProps>) {
  const style: CSSProperties = disabled ? { pointerEvents: "none" } : {};
  return (
    <Link href={href} style={style}>
      {children}
    </Link>
  );
}
