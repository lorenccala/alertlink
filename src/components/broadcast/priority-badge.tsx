import { Badge } from "@/components/ui/badge";
import type { AlertPriority } from "@/types";
import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: AlertPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const priorityStyles: Record<AlertPriority, string> = {
    low: "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30",
    critical: "bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30 animate-pulse",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize text-xs px-2.5 py-1 font-semibold",
        priorityStyles[priority],
        className
      )}
    >
      {priority}
    </Badge>
  );
}
