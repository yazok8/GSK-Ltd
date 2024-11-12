const nextConfig = {
    images: {
        domains: ['gsk-ltd.s3.us-east-2.amazonaws.com'], // Replace with your actual bucket domain
      },
    env:{
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      BUCKET_NAME:process.env.AWS_S3_BUCKET_NAME
    },
};

export default nextConfig