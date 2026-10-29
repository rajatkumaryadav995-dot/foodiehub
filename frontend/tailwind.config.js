/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#18231e',
        muted: '#718078',
        cream: '#fbfaf7',
        green: { 50: '#eef7f0', 100: '#dcefe1', 600: '#287348', 700: '#205d3b' },
        orange: { 50: '#fff2e8', 500: '#ed8848', 600: '#d86f31' }
      },
      boxShadow: {
        soft: '0 12px 40px rgba(27, 45, 35, .08)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
