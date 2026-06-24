import { cn } from "@/lib/utils";

// شعار أصلي لـ "وصّل دم": قطرة دم تتضمن مسار اتصال يربط نقطتين
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-9 w-9", className)}
      role="img"
      aria-label="شعار وصّل دم"
    >
      <path
        d="M24 3C24 3 9 19.5 9 30a15 15 0 1 0 30 0C39 19.5 24 3 24 3Z"
        className="fill-blood-600"
      />
      <circle cx="17.5" cy="31" r="3" className="fill-white" />
      <circle cx="30.5" cy="31" r="3" className="fill-white" />
      <path
        d="M17.5 31c4-6 9-6 13 0"
        className="stroke-white"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
