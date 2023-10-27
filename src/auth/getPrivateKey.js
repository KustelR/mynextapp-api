import 'dotenv/config'


export default async function getPrivateKey() {
    return process.env.SERVER_KEY
}