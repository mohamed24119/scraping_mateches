const express = require('express');
const path = require('path');
const cron = require('node-cron');
const scrape_today_matches = require('./scraping/today');
const scrape_tomorrow_matches = require('./scraping/tomorrow');
const scrape_yesterday_matches = require('./scraping/yesterday');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors());


// التشغيل للمرة الأولى
scrape_today_matches();
scrape_tomorrow_matches();
scrape_yesterday_matches();

app.use('/data', express.static(path.join(__dirname, 'data')));

app.get('/api/:file', (req, res) => {
  const fileName = req.params.file;

  const safeName = fileName.replace(/[^a-zA-Z0-9-_]/g, '');
  const fullPath = path.join(__dirname, 'data', `${safeName}.json`);

  res.sendFile(fullPath, (err) => {
    if (err) {
      res.status(404).json({ error: 'الملف غير موجود' });
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});