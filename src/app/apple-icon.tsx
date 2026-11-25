import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#141414",
          borderRadius: "36px",
        }}
      >
        <svg
          width="116"
          height="116"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.3 6.5H17.7L25.5 25.5H21.7L16 11.2L10.3 25.5H6.5L14.3 6.5Z"
            fill="#fcfcfc"
          />
          <path
            d="M16 17.8L19.2 22.8L16 21.1L12.8 22.8L16 17.8Z"
            fill="#fcfcfc"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
