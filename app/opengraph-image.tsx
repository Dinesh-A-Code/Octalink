import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — digital studio`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          color: "#f5f4f0",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: "0.24em",
            fontWeight: 600,
          }}
        >
          {site.name.toUpperCase()}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 76,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: 900,
          }}
        >
          We build digital experiences for ambitious businesses.
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#8a8a8f",
            letterSpacing: "0.1em",
          }}
        >
          <span>LANDING PAGES</span>
          <span>WEBSITES</span>
          <span>APPLICATION SOFTWARE</span>
        </div>
      </div>
    ),
    size,
  );
}
