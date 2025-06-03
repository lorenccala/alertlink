const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'sq'],
    localeDetection: false, // Optional: Disable locale detection if you want to handle it manually
  },
  localePath: path.resolve('./public/locales'),
};