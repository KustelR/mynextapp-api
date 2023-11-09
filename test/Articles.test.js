import { createArticle, getArticle } from "#src/requestHandlers/articles/index.ts";

async function mockDbCall(data) {
    return (data)
}

async function mockDbRead(query, requesterLogin, isPrivate, limit) {
    let result = [];
    let itemCount =  limit ? limit : 10;
    for (let i = 0; i < itemCount; i++) {
        result.push(dbMockArticle)
    }
    return [result, requesterLogin ? 1 : 0]
}

const mockArticle = {
    title: "Mock Article",
    body: "It's fake u are in the matrix",
    description: "It's fake u are in the matrix",
    tags: "fake, u, are, in, the, matrix"
}

const dbMockArticle = {
  "_id": "653e44285438b18dbe3d252f",
  "title": "mock thing",
  "postTime": 1699538183,
  "authorLogin": "fakeman",
  "votes": 12,
  "upvotedBy": [
    "fakeman",
    "2",
    "3",
    "4",
    "5",
  ],
  "downvotedBy": ["notfakeman"],
  "body": "i'm fake",
  "tags": [
    "mock, test, jest"
  ],
  "description": "mock",
  "__v": 493
}



describe("Article API tests", () => {
    test('Should create without error', async () => {
        const result = await createArticle(mockArticle, "fakeman", mockDbCall)
        expect(result).toBeDefined()
        expect.objectContaining(result, mockArticle);
        expect(result).toHaveProperty('postTime');
        expect(result).toHaveProperty('postTime');
        expect(result).toHaveProperty('authorLogin', "fakeman");

    });

    describe("Article reading", () => {
        test("Should return 10 mock articles without error", async () => {
            const result = await getArticle({}, null, null, mockDbRead);
            expect(result).toBeDefined();
            expect(result).toHaveLength(10);
            expect.objectContaining(result[0], dbMockArticle);
        })
        test("Should return 1 article with vote data", async () => {
            const result = await getArticle({}, "fakeman", 1, mockDbRead);
            expect(result).toBeDefined();
            expect(result.requesterVote).toBe(1);
            expect.objectContaining(result, dbMockArticle);
        })
    });
});