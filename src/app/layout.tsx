import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getProfile } from "@/lib/profile";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  weight: ["500", "600", "700"],
  variable: "--font-display"
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-sans"
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: profile.title,
      template: `%s | ${profile.name}`
    },
    description: profile.description,
    alternates: {
      canonical: siteConfig.url
    },
    openGraph: {
      title: profile.title,
      description: profile.description,
      url: siteConfig.url,
      siteName: profile.name,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: profile.title
        }
      ],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: profile.title,
      description: profile.description,
      images: ["/opengraph-image"]
    }
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();

  return (
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${jakarta.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header name={profile.name} />
        <main id="main-content">{children}</main>
        <Footer name={profile.name} tagline={profile.tagline} />
      </body>
    </html>
  );
}
