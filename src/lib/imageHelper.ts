export const getImageSrc = (path: string | undefined | null) => {
  if (!path) {
    return "/fallback.jpg"; // Ensure you have this fallback image in your public directory
  }

  // If it's already a full URL, return as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Get the S3 bucket URL from environment variable
  const bucketUrl = process.env.NEXT_PUBLIC_S3_BUCKET_URL;
  
  // If no bucket URL is defined, throw an error during development
  if (!bucketUrl) {
    console.error("S3 bucket URL is not defined in environment variables");
    return "/fallback.jpg";
  }

  // Clean up the path and construct the full URL
  const sanitizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${bucketUrl.trim()}/${sanitizedPath}`;
};