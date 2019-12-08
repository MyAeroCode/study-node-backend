import express from "express";
import { errorOccur, hello, errorPass, errorConsume } from "./Handlers";
const app = express();

/**
 * Exercise 10)
 *      - AWS Serverless Express
 *      - Error Handeling
 *
 * Result :
 *  Hello!
 *  Hello!
 *  Error Occur!
 *  Error passed to next.
 *  Error consumed.
 *  Hello!
 *  Hello!
 */
app.use(hello);
app.use(hello);
app.use(errorOccur);
app.use(hello);
app.use(hello);
app.use(errorPass);
app.use(hello);
app.use(hello);
app.use(errorConsume);
app.use(hello);
app.use(hello);

export default app;
