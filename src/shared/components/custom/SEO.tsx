import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
}

const SEO: React.FC<SEOProps> = ({
  title = "Qubic Portal - Decentralized Exchange on Qubic Network",
  description = "Trade tokens instantly with the best rates on Qubic Portal. Experience lightning-fast swaps, deep liquidity, and secure trading on the Qubic network's premier DEX.",
  keywords = "Qubic, DEX, decentralized exchange, crypto trading, token swap, DeFi, Qubic network, liquidity pools, cryptocurrency",
  canonical = "https://qubicportal.org/",
  ogType = "website",
  ogImage = "https://qubicportal.org/og-image.png",
  twitterCard = "summary_large_image",
}) => {
  const fullTitle = title.includes("Qubic Portal") ? title : `${title} | Qubic Portal`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Canonical */}
      <link rel="canonical" href={canonical} />
    </Helmet>
  );
};

export default SEO;

