import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/profile";

export const alt = "Personal portfolio + knowledge blog";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export const dynamic = "force-dynamic";

export default async function Image() {
  const profile = await getProfile();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#eef8f3",
          color: "#142119",
          padding: "64px",
          border: "12px solid #142119",
          fontFamily: "Arial"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            fontWeight: 700
          }}
        >
          <span>
            {profile.name}
            <span style={{ color: "#5ed8c8" }}>.</span>
          </span>
          <span>Portfolio + Knowledge Blog</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28
          }}
        >
          <div
            style={{
              width: 180,
              height: 22,
              borderRadius: 999,
              background: "#f8dc7a",
              border: "2px solid #142119"
            }}
          />
          <div
            style={{
              maxWidth: 900,
              fontSize: 76,
              lineHeight: 0.96,
              letterSpacing: "-0.06em",
              fontWeight: 700
            }}
          >
            {profile.home.heroTitle}
          </div>
        </div>
      </div>
    ),
    size
  );
}
