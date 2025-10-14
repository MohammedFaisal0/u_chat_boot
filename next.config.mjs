/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
  },
};

export default nextConfig;
