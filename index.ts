const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP
import { Request, Response, NextFunction } from 'express';
import userSchema from './schemas/schema'

const server = express();
const PORT = 4000;
server.use("/salutGraphQL", expressGraphQL({
    graphiql: true,
    schema: userSchema
}))
server.get('/', (req: Request, res: Response) => res.send('Express + TypeScript Server.......'));
server.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});