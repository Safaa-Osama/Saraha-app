import { config } from "dotenv";
import { resolve } from "node:path";

 let envPath = {
    development: resolve("config/.env.development"),
    production: resolve("config/.env.production")
}
config({
    path: envPath[process.env.NODE_ENV]
});

let PORT = process.env.PORT;
let PRIVATE_KEY = process.env.PRIVATE_KEY;
let DB_URI = process.env.DB_URI;
let CLIENT_ID = process.env.CLIENT_ID
let SALT_ROUND = process.env.SALT_ROUND

export {
    PORT,
    PRIVATE_KEY,
    DB_URI,
    envPath,
    CLIENT_ID,
    SALT_ROUND
};
