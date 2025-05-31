const scrape_matches = require('./scrape_matches');
module.exports = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return scrape_matches(yesterday, 'yesterday.json');
};
