import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Buy VIP fancy mobile numbers online at Fancy Number Shop, Mukkom, Calicut, Kerala";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const mark = await readFile(join(process.cwd(), "public/images/logo-mark.png"));
  const src = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #111111 0%, #1c1408 55%, #e88700 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} width={64} height={62} alt="" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>Fancy Number Shop</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
            Buy VIP fancy mobile numbers online
          </div>
          <div style={{ marginTop: 20, fontSize: 28, opacity: 0.85 }}>
            Mukkom, Calicut, Kerala 673602 · UPC in 60 minutes
          </div>
        </div>
        <div style={{ fontSize: 24, opacity: 0.8 }}>fancynumbershop.com · 97478 88999</div>
      </div>
    ),
    size,
  );
}
