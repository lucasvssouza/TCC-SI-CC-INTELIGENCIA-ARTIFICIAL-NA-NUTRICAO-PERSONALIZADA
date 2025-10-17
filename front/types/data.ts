export interface Data {
    nome: string;
    sexo: string;
    idade: number;
    altura: number;
    peso: number;
    objetivo: number;
    refeicoes: RefeicoesProps[];
    suplementos: string[];
    allergies?: string | boolean;
}

interface RefeicoesProps {
    horario: string;
    nome: string;
    alimentos: string[];
}