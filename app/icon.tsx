import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Placeholder monogram — replace with a real mark when one exists. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0b",
          color: "#f5f4f0",
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "-0.05em",
        }}
      >
        O
      </div>
    ),
    size,
  );
}
