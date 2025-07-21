import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output:'standalone',
    turbo: {
        rules: {
            '*.css': {
                loaders: ['@tailwindcss/postcss'],
            },
        },
    },};

export default nextConfig;
