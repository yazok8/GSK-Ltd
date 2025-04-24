export const getImageSrc = (path: string | undefined | null) => {
  if (!path) {
    return "/fallback.jpg";
  }

  // If it's already a full URL, return as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  
  // Handle test environment
  if (process.env.NODE_ENV === 'test') {
    // Check if this is a test image path
    if (path.includes('test-images/')) {
      return path; // Return the local path for test images
    }
    
    // Check if this is a test entity created by our tests
    if (path.includes('PLAYWRIGHT_TEST_')) {
      return "/test-images/test-fallback.jpg";
    }
  }
  
  // Safety check for test data regardless of environment
  if (path.includes('PLAYWRIGHT_TEST_')) {
    return "/test-images/test-fallback.jpg";
  }
  
  // Get the S3 bucket URL
  const bucketUrl = process.env.NEXT_PUBLIC_S3_BUCKET_URL;
  
  if (!bucketUrl) {
    console.error("S3 bucket URL is not defined in environment variables");
    return "/fallback.jpg";
  }

  // Clean up the path
  let sanitizedPath = path;
  if (sanitizedPath.startsWith("/")) {
    sanitizedPath = sanitizedPath.slice(1);
  }
  
  return `${bucketUrl.trim()}/${sanitizedPath}`;
};