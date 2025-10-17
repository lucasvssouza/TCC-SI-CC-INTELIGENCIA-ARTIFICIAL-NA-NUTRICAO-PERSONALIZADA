import crypto from "crypto";
import jwt from "jsonwebtoken";
import { db } from "../database/database";

interface UserData {
  name: string;
  email: string;
  password: string;
}

export class AuthService {
  private JWT_SECRET = process.env.JWT_SECRET || "secret_key"

  // Função para gerar hash da senha com salt
  private hashPassword(password: string, salt?: string) {
    const finalSalt = salt || crypto.randomBytes(16).toString("hex")
    const hash = crypto
      .pbkdf2Sync(password, finalSalt, 1000, 64, "sha512")
      .toString("hex")
    return { hash, salt: finalSalt }
  }

  // Função para gerar token JWT
  private generateToken(payload: object) {
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: "7d" })
  }

  // Registro de usuário
  async register({ name, email, password }: UserData) {
    // Verifica se já existe usuário com esse e-mail
    const [existing]: any = await db.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    )

    if (existing.length > 0) {
      throw new Error("Usuário já existe!")
    }

    // Criptografa senha
    const { hash: passwordHash, salt } = this.hashPassword(password)

    // Insere novo usuário no banco
    await db.execute(
      "INSERT INTO usuarios (nome, email, senha_hash, salt) VALUES (?, ?, ?, ?)",
      [name, email, passwordHash, salt]
    )

    // Gera token JWT
    const token = this.generateToken({ email, name })
    return { token, name }
  }

  // Login de usuário
  async login(email: string, password: string) {
    const [rows]: any = await db.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    )

    if (rows.length === 0) {
      throw new Error("Usuário não encontrado!")
    }

    const user = rows[0]

    // Recria hash da senha informada com o salt salvo
    const { hash } = this.hashPassword(password, user.salt)

    if (hash !== user.senha_hash) {
      throw new Error("Usuário e/ou senha inválidos!")
    }

    const token = this.generateToken({ email, name: user.nome })
    return { token, name: user.nome }
  }
}
