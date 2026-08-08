/**
 * Subtle brand watermark for the admin area. Purely decorative: hidden from
 * assistive tech, ignores pointer/click events, and sits behind all real
 * dashboard content (cards/tables/forms are opaque, so it never competes with
 * anything interactive).
 */
export function AdminWatermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 right-0 left-64 z-0 flex select-none items-center justify-center overflow-hidden"
    >
      <img
        src="/logo.jpg"
        alt=""
        draggable={false}
        className="w-[55vw] min-w-[180px] max-w-[440px] opacity-[0.05]"
      />
    </div>
  );
}
