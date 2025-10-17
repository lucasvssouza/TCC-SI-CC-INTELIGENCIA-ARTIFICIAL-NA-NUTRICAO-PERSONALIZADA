import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/AuthService";

interface RegisterBody {
    name: string;
    email: string;
    password: string;
}

interface LoginBody {
    email: string;
    password: string;
}

export class AuthController {
    private authService = new AuthService();

    async register(request: FastifyRequest, reply: FastifyReply) {
        const { name, email, password } = request.body as RegisterBody

        try {
            const result = await this.authService.register({ name, email, password })
            reply.send(result);
        } catch (err: any) {
            reply.status(400).send({ error: err.message })
        }
    }

    async login(request: FastifyRequest, reply: FastifyReply) {
        const { email, password } = request.body as LoginBody

        try {
            const result = await this.authService.login(email, password)
            reply.send(result)
        } catch (err: any) {
            reply.status(400).send({ error: err.message })
        }
    }
}
