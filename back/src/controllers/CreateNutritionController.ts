import { FastifyRequest, FastifyReply } from "fastify";

import { CreateNutritionService } from "../services/CreateNutritionService";

export interface DataProps {
    name: string;
    weight: string;
    height: string;
    age: string;
    gender: string;
    objective: string;
    level: string;
    hipertensive: boolean;
    diabetic: boolean;
    allergies?: string | boolean;
}

class CreateNutritionController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const { name, weight, height, age, gender, objective, level, hipertensive, diabetic, allergies } = request.body as DataProps

        const createNutritionService = new CreateNutritionService()
        const nutrition = await createNutritionService.execute({ name, weight, height, age, gender, objective, level, hipertensive, diabetic, allergies })

        reply.send(nutrition)
    }
}

export { CreateNutritionController }