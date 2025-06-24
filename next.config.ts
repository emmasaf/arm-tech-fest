import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbo: {
        rules: {
            '*.css': {
                loaders: ['@tailwindcss/postcss'],
            },
        },
    },};

export default nextConfig;
