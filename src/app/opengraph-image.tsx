import { ImageResponse } from "next/og";
import { SITE_DATA, SITE_URL } from "@/data/site";

const SITE_HOST = new URL(SITE_URL).host;

export const alt = `${SITE_DATA.profile.name} | ${SITE_DATA.profile.role}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#141414",
          color: "#f2f2f2",
          padding: "72px 84px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "14px",
              backgroundColor: "#f2f2f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.3 6.5H17.7L25.5 25.5H21.7L16 11.2L10.3 25.5H6.5L14.3 6.5Z"
                fill="#141414"
              />
              <path
                d="M16 17.8L19.2 22.8L16 21.1L12.8 22.8L16 17.8Z"
                fill="#141414"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: "28px",
              color: "#a0a0a0",
              letterSpacing: "-0.02em",
            }}
          >
            {SITE_HOST}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: "68px",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.08,
            }}
          >
            {SITE_DATA.profile.name}
          </div>
          <div
            style={{
              fontSize: "30px",
              color: "#b8b8b8",
              lineHeight: 1.35,
            }}
          >
            {SITE_DATA.profile.role}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "12px",
            borderTop: "1px solid #2b2b2b",
            paddingTop: "24px",
            fontSize: "19px",
            color: "#8c8c8c",
          }}
        >
          <span>Vulnerability Assessment &amp; Penetration Testing</span>
          <span>·</span>
          <span>Bug Bounty</span>
          <span>·</span>
          <span>Governance, Risk &amp; Compliance</span>
          <span>·</span>
          <span>Incident Management</span>
          <span>·</span>
          <span>Security Engineering</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

export const dynamic = "force-static";
