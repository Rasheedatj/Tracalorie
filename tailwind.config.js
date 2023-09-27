/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.{html,js}'],
  theme: {
    extend: {
      colors: {
        primary: '#599f3d',
        primaryDark: '#212529',
        white: '#ffffff',
        grayPrimary: '#f8f9fa',
        grayBorder: '#0000002d',
        danger: '#dc3545',
        orange: '#fd7e14',
        progress: '#e9ecef',
        modal: '#0000002d',
        close: '#dee2e6',
      },
    },
  },
  plugins: [],
};
