// tailwind.config.js

/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",        // Next.js App Router (if used)
      "./pages/**/*.{js,ts,jsx,tsx}",      // Next.js Pages Router
      "./components/**/*.{js,ts,jsx,tsx}", // React Components
      "./src/**/*.{js,ts,jsx,tsx}",        // Source Directory
      // Add other paths as needed
    ],
    theme: {
      extend: {
        colors: {
          'brand-teal': '#14B8A6',  // Custom teal color
          'brand-blue': '#1E40AF',  // Custom blue color
          // Add other custom colors here
        },
        fontFamily: {
          'roboto': ['Roboto', 'sans-serif'],  // Custom font family
        },
        // Add other theme extensions here
      },
    },
    plugins: [
    ],
  }
  
  export default tailwindConfig;
  