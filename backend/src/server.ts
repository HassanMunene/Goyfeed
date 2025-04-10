import express from "express";
import type { Application } from "express";
import { ApolloServer } from "apollo-server-express";

import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

// load the .env file
dotenv.config();
// initialize prisma client
const prisma = new PrismaClient();
// create an express app
const app = express() as any;

// enable cross-origin resource sharing. nd accept requests from different domains (useful for frontend → backend calls).
// we want to enable CORS for our frontend app, so we specify the origin of the frontend app.
app.use(cors({
    origin: [
        "https://goyfeed-git-main-hassan-munenes-projects.vercel.app",
        "https://goyfeed.vercel.app"
    ],
    credentials: true,
}));


// parse incoming json requests
app.use(express.json());

// will take a token as an argument, verify the user based on the JWT token. We are assuming
// the token is provided in the form of Bearer <token>. we will strip the Bearer and remain with actual token
// the secret key is used to sign an verify the JWT. exclamation mark (!) is a TypeScript non-null assertion operator, meaning you're telling TypeScript that APP_SECRET will definitely be available i.e not undefined.
// if token is valid the verifcation passes and return a decoded payload of user info
interface JwtPayload {
    userId: string;
}

const getUser = (token: string): JwtPayload | null => {
    try {
        if (token) {
            return jwt.verify(token.replace('Bearer ', ''), process.env.APP_SECRET!) as JwtPayload;
        }
        return null;
    } catch (error) {
        return null;
    }
}

// Now we set up an Apollo server which is a graphql server 
// typeDefs are the graphQl schema.
// resolvers are functions that handle graphql queries and mutations
// context is a shared  object for each request
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const token = req.headers.authorization || '';
        const user = getUser(token);
        return { prisma, userId: user?.userId };
    }
})

// Next phase is to start the server
async function startServer() {
    await server.start();
    // attach apollo server to express
    server.applyMiddleware({ app });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`server ready at  http://localhost:${PORT}${server.graphqlPath}`);
    })
}

startServer();

// this one here ensures that Prisma disconnects cleanly when the server is stopped.
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});