import { Schema, model } from 'mongoose'

export default model(
    'tweet',
    new Schema({
        trend: String,
        text: String,
        href: String,
        at: Date,
        source: String,
        image: String,
        desc: String,
    })
)
