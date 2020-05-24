import mongoose from 'mongoose'
require('dotenv').config()

export default (callback: () => Promise<void>) => {
    const { DB_PASSWORD, DB_USER } = process.env
    const url = `mongodb://${DB_USER}:${DB_PASSWORD}@ds155825.mlab.com:55825/k-info`
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    var db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error:'))
    db.once('open', async () => callback())
}
