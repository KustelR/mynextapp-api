import {genRandomBytes} from "./cryptothings/CipherThing.js";

const sessions = {}

async function createSession(payload) {
    const secret = (await genRandomBytes(512));
    const id = secret.toString('base64');
    const token = {payload: payload, id: id};

    storeSession(token)
    return id;
}

async function storeSession(token) {
    sessions[token.id] = token;
}

async function getSession(id) {
    return sessions[id];
}

async function verifyAction(token, action) {
    const storedSession = await getSession(token);
    
    if (storedSession.payload.permissions[action] === true) {
        return true;
    }
    else {
        throw new Error('access denied')
    }
}


async function verifyIdentity(token, identity) {
    const storedSession = await getSession(token);
    
    if (storedSession.payload.identity[identity] === true) {
        return true;
    }
    else {
        throw new Error('access denied')
    }
}


export {
    createSession, verifyIdentity, verifyAction
}