"use client";
import Image from "next/image";
import { translations, Lang } from "@/lib/i18n";

interface GalleryProps { lang: Lang; }

const galleryImages = [
  { src: "/images/clinic-reception.png", alt: "Clinic Reception" },
  { src: "/images/clinic-roses.png", alt: "Clinic Interior" },
  { src: "/images/dr-yara.png", alt: "Dr. Yara Salem" },
  { src: "/images/clinic-reception.png", alt: "Luxury Interior" },
  { src: "/images/clinic-roses.png", alt: "Clinic Ambiance" },
  { src: "/images/dr-yara.png", alt: "Dr. Yara" },
];

// Duplicate for seamless infinite scroll
const row1 = [...galleryImages, ...galleryImages];
const row2 = [...galleryImages.slice(2), ...galleryImages, ...galleryImages.slice(0, 2)];

export default function Gallery({ lang }: GalleryProps) {
  const t = translations[lang].gallery;
  const dir = translations[lang].dir;

  return (
    <section dir={dir} style={{ padding: "100px 0", background: "#0F0F0F", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "60px", padding: "0 48px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "#D4621A", marginBottom: "16px" }}>
          {t.eyebrow}
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", fontWeight: 300, color: "white", lineHeight: 1.2 }}>
          {t.title} <em style={{ fontStyle: "italic", color: "#D4621A" }}>{t.titleItalic}</em>
        </div>
      </div>

      {/* Row 1 — scrolls left */}
      <div style={{ overflow: "hidden", marginBottom: "16px" }}>
        <div
          className="scroll-left"
          style={{ display: "flex", gap: "16px", width: "max-content" }}
        >
          {row1.map((img, i) => (
            <div
              key={i}
              style={{
                width: "340px",
                height: "240px",
                position: "relative",
                flexShrink: 0,
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                style={{ objectFit: "cover", transition: "transform 0.6s ease" }}
                sizes="340px"
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)",
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div style={{ overflow: "hidden" }}>
        <div
          className="scroll-right"
          style={{ display: "flex", gap: "16px", width: "max-content" }}
        >
          {row2.map((img, i) => (
            <div
              key={i}
              style={{
                width: "260px",
                height: "180px",
                position: "relative",
                flexShrink: 0,
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                style={{ objectFit: "cover", transition: "transform 0.6s ease" }}
                sizes="260px"
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(15,15,15,0.5) 0%, transparent 60%)",
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom label */}
      <div style={{ textAlign: "center", marginTop: "48px", padding: "0 48px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "16px",
          fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#444",
        }}>
          <span style={{ display: "block", width: "40px", height: "0.5px", background: "#333" }} />
          Deir Hanna, Northern District
          <span style={{ display: "block", width: "40px", height: "0.5px", background: "#333" }} />
        </div>
      </div>
    </section>
  );
}
