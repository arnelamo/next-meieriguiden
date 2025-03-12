import { cn } from "@/lib/utils";
import { Dairy, InfoPoint } from "@/types/diary";
import { Minus, Plus, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";

export const CardGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:auto-rows-auto md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const CardGridItem = ({ className, dairy }: { className?: string; dairy: Dairy }) => {
  const { name, logo, info_points: infoPoints, uses_bovaer } = dairy;
  return (
    <div
      className={cn(
        "group/bento relative cursor-pointer flex-col space-y-4 overflow-hidden rounded-xl border border-border bg-white p-4 pb-8 shadow-input transition duration-200 hover:shadow-lg dark:border-white/[0.2] dark:bg-black dark:shadow-none",
        className,
      )}
    >
      {/* Logo area */}
      <div className="flex items-center">
        <div className="flex h-[120px] w-full items-center rounded-sm bg-gradient-to-br from-neutral-200 to-neutral-100">
          {dairy.logo ? (
            <div className="relative mx-auto h-2/3 w-full">
              <Image src={logo} alt={name} fill className="object-contain" sizes="100px" />
            </div>
          ) : (
            <BentoListItemSkeleton />
          )}
        </div>
      </div>
      {/* Description area */}
      <div className="flex flex-col gap-2 transition duration-200 group-hover/bento:translate-x-2">
        <div className="relative flex items-center justify-between">
          <div className="text-lg font-semibold">{name}</div>
          <div
            className={`t-0 absolute -top-9 right-4 flex items-center justify-center rounded-full ${uses_bovaer ? "bg-red-500" : "bg-green-500"} p-2`}
          >
            {uses_bovaer ? (
              <ThumbsDown size={24} strokeWidth={2.5} className="stroke-white pt-1" />
            ) : (
              <ThumbsUp size={24} className="stroke-white pb-1" />
            )}
          </div>
        </div>
        {/* <div className="line-clamp-6 text-sm leading-snug">{description}</div> */}
        <InfoPoints infoPoints={infoPoints || []} />
      </div>

      {/* Fade in footer area */}
      {/* <div
        // className={`absolute bottom-0 left-0 right-0 flex h-[20px] translate-y-full transform items-center justify-center ${uses_bovaer ? "bg-red-500/25" : "bg-green-500"} py-2 text-xs transition duration-200 group-hover/bento:translate-y-0`}
        className={`absolute bottom-1 right-8 flex h-[20px] translate-y-full transform items-center justify-center py-2 text-xs transition duration-200 group-hover/bento:translate-y-0`}
      >
        <MoveRight size={16} className="mr-2" /> Mer info
      </div> */}
    </div>
  );
};

export const BentoListItemSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "group/bento flex h-[120px] w-full rounded-xl border border-border bg-gradient-to-br from-neutral-200 to-neutral-100 p-4 dark:border-white/[0.2] dark:from-neutral-900 dark:to-neutral-800",
        className,
      )}
    />
  );
};

const InfoPoints = ({ infoPoints }: { infoPoints: InfoPoint[] }) => {
  return (
    <ul className="">
      {infoPoints.map((point, i) => (
        <li key={i} className="mb-1 flex gap-2 last:mb-0">
          <div className="mt-1 flex-shrink-0">
            {point.point_type === "pro" ? (
              <Plus size={14} className="stroke-green-400" />
            ) : (
              <Minus size={14} className="stroke-red-400" />
            )}
          </div>
          <div className="text-sm font-normal">{point.text}</div>
        </li>
      ))}
    </ul>
  );
};
