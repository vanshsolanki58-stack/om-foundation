import React from "react";

export function CosmicBackground() {
  return (
    <div className="cosmic-bg pointer-events-none fixed inset-0 overflow-hidden z-[-1]" aria-hidden="true">
      <div
        className="cosmic-orb animate-pulse absolute rounded-full blur-3xl opacity-30"
        style={{
          width: "40vw",
          height: "40vw",
          background: "radial-gradient(circle, #f97316 0%, rgba(249, 115, 22, 0) 70%)",
          top: "10%",
          left: "-10%",
        }}
      />
      <div
        className="cosmic-orb animate-pulse absolute rounded-full blur-3xl opacity-20"
        style={{
          width: "35vw",
          height: "35vw",
          background: "radial-gradient(circle, #0284c7 0%, rgba(2, 132, 199, 0) 70%)",
          bottom: "5%",
          right: "-5%",
        }}
      />
      <div
        className="cosmic-orb animate-pulse absolute rounded-full blur-3xl opacity-20"
        style={{
          width: "25vw",
          height: "25vw",
          background: "radial-gradient(circle, #f59e0b 0%, rgba(245, 158, 11, 0) 70%)",
          top: "45%",
          left: "55%",
        }}
      />
    </div>
  );
}
