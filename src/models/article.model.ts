import { Schema, model } from 'mongoose'

export default model(
    'article',
    new Schema({
        trend: String,
        text: String,
        href: String,
        at: Date,
        target: Boolean,
    })
)
