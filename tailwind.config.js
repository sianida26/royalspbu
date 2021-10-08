const colors = require('tailwindcss/colors')

module.exports = {
  prefix: 'tw-',
  purge: [
    './storage/framework/views/*.php',
    './resources/**/*.blade.php',
    './resources/**/*.js',
    './resources/**/*.jsx',
    './resources/**/*.ts',
    './resources/**/*.tsx',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      borderWidth: {
        '10': '10px',
      },
      colors: {
        sky: colors.sky,
        primary: colors.sky,
        orange: colors.orange,
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
