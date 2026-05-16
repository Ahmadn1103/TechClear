import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "TechClear | PM + AI Flagship Program for IT Professionals",
  description: "TechClear equips IT professionals with SAFe Scrum Master certification, AI integration skills, and 1-on-1 mentorship. Join our 8-week PM + AI Flagship Program and advance your tech career.",
  keywords: [
    "IT training program",
    "SAFe Scrum Master certification",
    "PM AI bootcamp",
    "project management training",
    "AI for IT professionals",
    "agile certification",
    "tech career advancement",
    "IT workforce training",
    "TechClear",
  ],
  authors: [{ name: "TechClear" }],
  creator: "TechClear",
  metadataBase: new URL("https://techclear.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://techclear.io",
    title: "TechClear | PM + AI Flagship Program for IT Professionals",
    description: "TechClear equips IT professionals with SAFe Scrum Master certification, AI integration skills, and 1-on-1 mentorship. Join our 8-week PM + AI Flagship Program.",
    siteName: "TechClear",
    images: [
      {
        url: "/assets/branding/og-image.png",
        width: 1200,
        height: 630,
        alt: "TechClear PM + AI Flagship Program",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechClear | PM + AI Flagship Program for IT Professionals",
    description: "TechClear equips IT professionals with SAFe Scrum Master certification, AI integration skills, and 1-on-1 mentorship.",
    images: ["/assets/branding/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/assets/branding/5.png", type: "image/png" },
    ],
    shortcut: "/assets/branding/5.png",
    apple: [
      { url: "/assets/branding/5.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/assets/branding/5.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "TechClear",
              url: "https://techclear.io",
              logo: "https://techclear.io/assets/branding/1.png",
              description: "TechClear equips IT professionals with SAFe Scrum Master certification, AI integration skills, and mentorship through an intensive 8-week PM + AI Flagship Program.",
              offers: {
                "@type": "Offer",
                name: "PM + AI Flagship Program",
                description: "An 8-week intensive program combining SAFe Scrum Master 6.0 certification with AI tools for IT leaders.",
                category: "Professional Training",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-black text-[#f4f4f5] antialiased cursor-none`}>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
