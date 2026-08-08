interface Props {
  fill?: string;
  flip?: boolean;
  className?: string;
}

/** Organic section transition, echoing the brand's soft, rounded visual language. */
export function WaveDivider({ fill = "#EAF6FC", flip = false, className = "" }: Props) {
  return (
    <div aria-hidden="true" className={`w-full overflow-hidden leading-none ${flip ? "rotate-180" : ""} ${className}`}>
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="h-14 w-full sm:h-20">
        <path d="M0,40 C240,100 480,0 720,30 C960,60 1200,10 1440,50 L1440,100 L0,100 Z" fill={fill} />
      </svg>
    </div>
  );
}
