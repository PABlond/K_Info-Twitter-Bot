require('dotenv').config()

const accountClient = {
    consumer_key: process.env.ACCOUNT_API_KEY,
    consumer_secret: process.env.ACCOUNT_API_SECRET,
    access_token_key: process.env.ACCOUNT_ACCESS_TOKEN,
    access_token_secret: process.env.ACCOUNT_ACESS_TOKEN_SECRET,
}

const client = {
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACESS_TOKEN_SECRET,
}

export default { client, accountClient }
