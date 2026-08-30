import { cn } from "@/lib/utils/cn";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("container-x", className)}>{children}</div>;
}
