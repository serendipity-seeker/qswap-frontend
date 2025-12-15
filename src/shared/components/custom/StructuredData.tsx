import React from "react";
import { Helmet } from "react-helmet-async";

interface StructuredDataProps {
  type?: "WebSite" | "WebPage" | "Organization";
  name?: string;
  description?: string;
  url?: string;
}

const StructuredData: React.FC<StructuredDataProps> = ({
  type = "WebSite",
  name = "Qubic Portal",
  description = "Decentralized exchange on Qubic network - Trade tokens instantly with the best rates",
  url = "https://qubicportal.org",
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url,
    ...(type === "Organization" && {
      logo: "https://qubicportal.org/logo.svg",
      sameAs: [
        // Add your social media links here
        // "https://twitter.com/qubicportal",
        // "https://github.com/qubicportal",
      ],
    }),
    ...(type === "WebSite" && {
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://qubicportal.org/swap?search={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
};

export default StructuredData;

