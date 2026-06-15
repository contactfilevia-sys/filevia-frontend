export default function sitemap() {
  const baseUrl = "https://filevia.org";

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },

    // ACTIVE SEO PAGES (ONLY THESE SHOULD BE INDEXED)

    {
      url: `${baseUrl}/word-to-pdf`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/excel-to-pdf`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/ppt-to-pdf`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/image-to-pdf`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/pdf-to-image`,
      lastModified: new Date(),
    },
  ];
}