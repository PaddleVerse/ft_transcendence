import React from "react";

export function GridBackground() {
  return (
    <div className="absolute h-full w-full bg-[#101823] z-[-1]   bg-grid-red-500/[0.5]  flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-[#0b1119]  [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    </div>
  );
}
