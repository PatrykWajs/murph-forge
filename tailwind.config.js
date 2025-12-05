/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                neon: {
                    blue: "#00F0FF",
                    pink: "#FF00FF",
                    green: "#00FF66",
                    purple: "#BC13FE",
                    dark: "#121212",
                    surface: "#1E1E1E",
                }
            },
            fontFamily: {
                heading: ["Inter-Bold", "sans-serif"],
                body: ["Inter-Regular", "sans-serif"],
            }
        },
    },
    plugins: [],
}
