import updateArticle from "../../database/methods/articles/update.js";
import getArticle from "../../database/methods/articles/get.js";
import { AccessDeniedError } from "../../errors/index.js";

interface keyable {
    [key: string]: any;
}

/**
 * updates article based on given data
 * @param data Article data to be updated
 * @param query url query string from request
 * @param authorLogin author login extracted from JWT
 * @param dbCall Function from db driver
 * @returns
 */
export default async function handle(
    data: keyable,
    query: any,
    headers: any,
    authorLogin: string | null,
    dbCall?: Function,
    dbFind?: Function
): Promise<keyable | null> {
    if (!dbCall) dbCall = updateArticle;
    if (!dbFind) dbFind = getArticle;
    const oldArticle = (await dbFind(query, 1))[0];
    if (oldArticle.authorLogin !== authorLogin) {
        throw new AccessDeniedError("You are not the article author");
    }
    const result = await dbCall(query, data);
    if (headers["accept"]) {
        const requestedContentType = headers["accept"].split(";");
        if (
            requestedContentType[0] === "application/json" &&
            requestedContentType[1] === "article"
        ) {
            return result;
        }
    }

    return null;
}
