import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

export function SEO({
    title = "Coach OS | Premium Fitness Business Management Platform",
    description = "Coach OS - Your Intelligent Coaching System. Seamlessly manage client progress, personalize workouts, and optimize health insights with AI-powered fitness business management.",
    keywords = "coach os, fitness business software, gym management system, personal trainer app, online coaching platform, workout builder software, nutrition planning app, client progress tracking, automated check-ins, fitness crm, health coaching tools, white label fitness app, strength training programming, macro calculator for clients",
    image = "https://coachos.io/og-image.jpg", // Ideally replace with actual hosted image URL in future
    url = "https://coachos.io"
}: SEOProps) {
    const siteTitle = title.includes("Coach OS") ? title : `${title} | Coach OS`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="Coach OS" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": "Coach OS",
                    "applicationCategory": "HealthApplication",
                    "operatingSystem": "Web",
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                    },
                    "description": description,
                    "image": image,
                    "softwareHelp": {
                        "@type": "CreativeWork",
                        "url": "https://coachos.io/support"
                    },
                    "author": {
                        "@type": "Organization",
                        "name": "Coach OS Team",
                        "url": "https://coachos.io"
                    }
                })}
            </script>
        </Helmet>
    );
}
