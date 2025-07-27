/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#006FFD',
        'light-blue': '#B3DAFF',
        'dark-gray': '#1E1E1E',
        'medium-gray': '#8F9098',
        'light-gray-bg': '#F8F9FE',
      },
      fontFamily: {
        'pretendard': ['Pretendard_GOV', 'sans-serif'],
        'Jalnan_2': ['Jalnan_2', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
