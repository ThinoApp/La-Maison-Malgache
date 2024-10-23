/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#6e5c43",
      },
      textColor: {
        primary: "#6e5c43",
      },
      borderColor: {
        primary: "#6e5c43",
      },
      fontFamily: {
        CaslonGraphique: "CaslonGraphique",
        MB: "MB Picture House One",
      },
    },
  },
  plugins: [],
};
