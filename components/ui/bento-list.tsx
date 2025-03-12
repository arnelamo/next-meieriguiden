import { cn } from "@/lib/utils";
import Image from "next/image";

export const BentoList = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return <div className={cn("flex flex-col space-y-2", className)}>{children}</div>;
};

export const BentoListItem = ({
  className,
  title,
  description,
  logoSrc,
}: {
  className?: string;
  title: string;
  description?: string | React.ReactNode;
  logoSrc?: string;
}) => {
  return (
    <div
      className={cn(
        "group/bento flex items-center justify-between gap-4 rounded-xl border border-border bg-white p-4 shadow-input transition duration-200 hover:shadow-lg dark:border-white/[0.2] dark:bg-black dark:shadow-none",
        className,
      )}
    >
      {/* Logo area */}
      <div className="flex items-center space-x-4">
        <div className="flex h-[80px] w-[120px] items-center rounded-sm bg-gradient-to-br from-neutral-200 to-neutral-100">
          {logoSrc ? (
            <div className="relative mx-auto h-2/3 w-full">
              <Image src={logoSrc} alt={title} fill className="object-contain" sizes="100px" />
            </div>
          ) : (
            <BentoListItemSkeleton />
          )}
        </div>
      </div>
      {/* Description area */}
      <div className="flex min-w-0 grow">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="font-sans font-bold">{title}</div>
          <div className="line-clamp-2 text-sm">{description}</div>
        </div>
      </div>
      {/* Actions/icons area */}
      <div className="flex flex-col">
        <button className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
        <button className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const BentoListItemSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "group/bento flex h-[100px] w-[150px] rounded-xl border border-border bg-gradient-to-br from-neutral-200 to-neutral-100 p-4 dark:border-white/[0.2] dark:from-neutral-900 dark:to-neutral-800",
        className,
      )}
    />
  );
};
