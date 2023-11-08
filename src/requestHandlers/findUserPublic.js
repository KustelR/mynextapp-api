import { verifyToken } from "../auth/jwt_gen.js";
import {MalformedTokenError} from "../errors/index.ts";

async function getUserPublic(login, mongoAPI) {
  return await mongoAPI.readUserPublic(login);
}

async function userPublicByAccessKey(accessToken, mongoAPI) {
  let token;
  try {
    token = await verifyToken(accessToken);
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      throw new MalformedTokenError();
    } else {
      throw err;
    }
  }

  const login = token.data.login;
  let userInstance;

  userInstance = await getUserPublic(login, mongoAPI);

  return userInstance;
}

export default userPublicByAccessKey;
