// Utility function to slugify strings for URLs
export const slugify = (text: string): string =>
    text
      .toLowerCase()
      .replace(/ & /g, "-and-") // Replace '&' with '-and-'
      .replace(/\s+/g, "-") // Replace spaces with '-'
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple '-' with single '-'
      .replace(/^-+/, "") // Trim '-' from start
      .replace(/-+$/, ""); // Trim '-' from end