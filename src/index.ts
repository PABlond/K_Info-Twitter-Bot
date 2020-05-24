import Bot from './bot'
import twitterConfig from './config/twitter.config'
import dbConnection from './config/db.config'

dbConnection(async () => {
  console.clear()
  console.log('[ ] Connected to database')
  const bot = new Bot(twitterConfig)
  await bot.run()
  const interval = 3 * 60 * 1000 // 3min()
  setInterval(bot.run, interval)
})
