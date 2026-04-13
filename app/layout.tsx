import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dr. Yara Salem | Dental & Facial Aesthetics",
  description: "Premium dental and facial aesthetics clinic in Deir Hanna. Invisalign, Botox, Fillers, Implants, Veneers, and General Dentistry.",
  keywords: "Dr Yara Salem, dentist Deir Hanna, facial aesthetics, invisalign, botox fillers, dental implants, veneers",
  openGraph: {
    title: "Dr. Yara Salem | Dental & Facial Aesthetics",
    description: "Premium dental and facial aesthetics clinic in Deir Hanna.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&family=Karla:wght@400;500;600;700&family=Sen:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
