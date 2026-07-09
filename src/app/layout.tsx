import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Nunito_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getProfile } from "@/lib/profile";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
};

const nunitoSans = Nunito_Sans({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-display"
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-sans"
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono"
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
      suppressHydrationWarning
      className={`${nunitoSans.variable} ${jakarta.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          // Set theme before paint to avoid a flash of the wrong theme.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header name={profile.name} />
        <main id="main-content">{children}</main>
        <Footer
          name={profile.name}
          tagline={profile.tagline}
          socials={profile.socials}
        />
      </body>
    </html>
  );
}
