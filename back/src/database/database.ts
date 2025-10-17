import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Variáveis de ambiente
const host = process.env.DB_HOST || "localhost"
const port = Number(process.env.DB_PORT) || 3306
const user = process.env.DB_USER || "root"
const password = process.env.DB_PASSWORD || ""
const database = process.env.DB_NAME || "mydb"

// Criando conexão
export const db = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});