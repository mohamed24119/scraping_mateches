const scrape_matches = require('./scrape_matches');
module.exports = () => {
  const today = new Date();
  return scrape_matches(today, 'today.json');
};
