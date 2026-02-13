import dotenv from "dotenv";

dotenv.config({ path: './config/.env' });


let port = process.env.PORT;
let privateKey = process.env.PRIVATEKEY;
let DB_url = process.env.DB_URL

export {
    port,
    privateKey,
    DB_url
};
