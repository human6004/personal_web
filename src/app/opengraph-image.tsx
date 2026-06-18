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
          background: "#f7f7f3",
          color: "#22251f",
          padding: "72px",
          fontFamily: "Arial"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28
          }}
        >
          <span>{profile.name}</span>
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
              width: 160,
              height: 20,
              borderRadius: 999,
              background: "#b9d66f"
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
