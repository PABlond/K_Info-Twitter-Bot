export interface IScrappedLinks {
    source: string
    text: string
    href: string
}

export interface IRelations {
    source: string
    text: string
    href: string
    trend: string
}

export interface ITwitterConfig {
    consumer_key: string
    consumer_secret: string
    access_token_key: string
    access_token_secret: string
}
