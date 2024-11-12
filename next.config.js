const nextConfig = {
    images: {
        domains: ['gsk-ltd.s3.us-east-2.amazonaws.com'], // Replace with your actual bucket domain
      },
    env:{
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    },
};

export default nextConfig