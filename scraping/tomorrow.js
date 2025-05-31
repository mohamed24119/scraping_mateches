const scrape_matches = require('./scrape_matches');
module.exports = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return scrape_matches(tomorrow, 'tomorrow.json');
};
