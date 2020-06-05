import twitter from 'twitter'
import { ITwitterConfig } from '../interfaces'

export default class Twitter {
    client: twitter
    accountClient: twitter

    constructor(config: {
        client: ITwitterConfig
        accountClient: ITwitterConfig
    }) {
        this.client = new twitter(config.client)
        this.accountClient = new twitter(config.accountClient)
    }

    getTrends = async (): Promise<string[]> => {
        const params = { id: 615702 }
        const [{ trends }] = (await this.client.get(
            'trends/place',
            params
        )) as any
        return trends.map(({ name }: { name: string }) => name)
    }

    postTweet = async ({
        trend,
        text: status,
        href: attachment_url,
    }: {
        trend: string
        href: string
        text: string
    }): Promise<any> => {
        const params = { status: `${status} ${attachment_url}` }
        try {
            return await this.accountClient.post('statuses/update', params)
        } catch (err) {
            console.log(err)
            return null
        }
    }
}
