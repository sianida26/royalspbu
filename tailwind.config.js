const colors = require('tailwindcss/colors')

module.exports = {
  prefix: 'tw-',
  purge: [
    './storage/framework/views/*.php',
    './resources/**/*.blade.php',
    './resources/**/*.js',
    './resources/**/*.vue',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        sky: colors.lightBlue,
        primary: colors.lightBlue,
      },
      maxHeight: {
        '3/4': '75%',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
