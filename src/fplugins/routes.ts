import {FastifyInstance} from "fastify";
import findUserPublic from '../requestHandlers/findUserPublic.js';
import MongoAPI from "../database/mongoAPI.js";
import MalformedTokenError from '../errors/MalformedTokenError.ts';
import authUser from "../utils/authUser.ts";
import type { FastifyRequest } from 'fastify'

import createArticle from "../requestHandlers/articles/create.js";
import getArticle from "../requestHandlers/articles/get.js";
import voteArticle from "../requestHandlers/articles/vote.js";
import deleteArticle from "../requestHandlers/articles/delete.js";
import getArticlesPreviews from "../requestHandlers/articles/getPreviews.js";


import 'dotenv/config';

const mongoAPI = new MongoAPI(process.env.MONGODB_URI);
mongoAPI.connect('myreactapp');


/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options
 */
export default async function routes (fastify: FastifyInstance, options: object) {


    fastify.get('/api/v2/users/me', async (request, reply) => {
        const accessToken = request.headers['x-access-token'];
        try {
            return await findUserPublic(accessToken, mongoAPI);
        } catch (error) {
            if (error instanceof MalformedTokenError) {
                reply.statusCode = 400;
                return {message: "Provided invalid token"}
            }
            return error;
        }
    })


    type Article = {
            title: String,
            body: String,
            tags: Array<string>,
            description: String
    }
    const articleBodySchema = {
        type: "object",
        required: ["title", "body", "tags", "description"],
        properties: {
            title: {type: "string"},
            description: {type: "string"},
            tags: {type: "array"},
            body: {type: "string"}
        }
    }
    fastify.post('/api/v2/articles', 
        {schema: {body: articleBodySchema}}, async (request: FastifyRequest<{ Body: Article }>, reply) => {
        const accessToken = request.headers['x-access-token'];
        if (!accessToken) {
            reply.statusCode = 400;
            return {message: "No token provided"}
        }
        if (typeof accessToken !== 'string') {
            reply.statusCode = 400;
            return {message: "Provided invalid provided"}
        }
        let authorLogin: string | null;
        const authResult = await authUser(accessToken, ["login"])
        if (authResult === null) {
            reply.statusCode = 400;
            return {message: "Provided invalid token"}
        }
        authorLogin = authResult.login;
        createArticle(request.body, authorLogin);
    })


    fastify.get('/api/v2/articles', async (request, reply) => {
        const accessToken = request.headers['x-access-token'];
        let authorLogin: string | null;
        const authResult = await authUser(accessToken, ["login"])
        if (authResult) authorLogin = authResult.login;
        else authorLogin = null;
        const article = await getArticle(request.query, authorLogin);
        if (!article) {
            reply.statusCode = 404;
            return {message: "No articles was found"};
        }
        return article;
    })


    fastify.get('/api/v2/articles/previews', async (request, reply) => {
        const articles = getArticlesPreviews(request.query);
        if (!articles) {
            reply.statusCode = 404;
            return {message: "No articles was found"}
        }
        return await getArticlesPreviews(request.query);
    })


    fastify.delete('/api/v2/articles', async (request, reply) => {
        const accessToken = request.headers['x-access-token'];
        const authResult = await authUser(accessToken, ["login", "articleDeletion"])
        try {
            return await deleteArticle(request.query, authResult);
        } catch (error) {
            if (error.name === "AccessDeniedError") {
                reply.statusCode = 403;
                return {message: "Access denied, invalid credentials"}
            }
            else throw error
        }
    })


    type VoteRequest = {
        voteChange: Number
    }
    const voteBodySchema = {
        type: "object",
        required: ['voteChange'],
        properties: {
            voteChange: {type: "number"}
        }
    }
    fastify.put('/api/v2/articles/vote', 
        {schema: {body: voteBodySchema}}, async (request: FastifyRequest<{ Body: VoteRequest }>, reply) => {
        const accessToken = request.headers['x-access-token'];
        let authorLogin: string | null;
        const authResult = await authUser(accessToken, ["login"])
        if (authResult) authorLogin = authResult.login;
        else authorLogin = null;

        return await voteArticle(request.query, { 
            login: authorLogin, 
            voteChange: request.body.voteChange
        });
    })
}
