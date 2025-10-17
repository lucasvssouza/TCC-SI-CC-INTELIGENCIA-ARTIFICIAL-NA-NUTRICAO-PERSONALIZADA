import { View, Text, StyleSheet, Pressable, ScrollView, Switch  } from "react-native";
import { router } from "expo-router";

import { Input } from "@/components/input";
import { Header } from "@/components/header";
import { Select } from "@/components/input/select";
import { useDataStore } from "@/store/data";

import { colors } from "@/constants/colors";

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from "react"

const schema = z.object({
    gender: z.string().min(1, { message: "O sexo é obrigatório" }),
    objective: z.string().min(1, { message: "O objetivo é obrigatório" }),
    level: z.string().min(1, { message: "Selecione seu nível" }),
    allergies: z.string().optional()
})

type FormData = z.infer<typeof schema>

export default function Create() {
    const { control, handleSubmit, formState: { errors, isValid }} = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    const setPageTwo = useDataStore(state => state.setPageTwo)

    const genderOptions = [
        { label: "Masculino", value: "Masculino" },
        { label: "Feminino", value: "Feminino" }
    ]

    const levelOptions = [
        { label: "Sedentário (pouco ou nenhuma atividade física", value: "Sedentário" },
        { label: "Levemente ativo (exercícios 1 a 3 vezes na semana)", value: "Levemente ativo (exercícios 1 a 3 vezes na semana)" },
        { label: "Moderadamente ativo (exercícios 3 a 5 vezes na semana)", value: "Moderadamente ativo (exercícios 3 a 5 vezes na semana)" },
        { label: "Altamente ativo (exercícios 5 a 7 vezes na semana)", value: "Altamente ativo (exercícios 5 a 7 vezes na semana)" }
    ]

    const objectiveOptions = [
        { label: "Emagrecer", value: "Emagrecer" },
        { label: "Hipertrofia", value: "Hipertrofia" },
        { label: "Hipertrofia e Definição", value: "Hipertrofia e Definição" },
        { label: "Definição", value: "Definição" }
    ]

    const [hipertensive, setHipertensive] = useState(false)
    const [diabetic, setDiabetic] = useState(false)

    function handleCreate(data: FormData) {
        setPageTwo({
            level: data.level,
            gender: data.gender,
            objective: data.objective,
            hipertensive,
            diabetic,
            allergies: data.allergies?.trim() || false
        })

        router.push("/nutrition")
    }

    return (
        <View style={styles.container}>
            <Header step="Passo 2" title="Finalizando dieta" />

            <ScrollView style={styles.content}>
                <Text style={styles.label}>Sexo:</Text>
                <Select 
                    control={control} 
                    name="gender" 
                    placeholder="Selecione seu sexo..." 
                    error={errors.gender?.message} 
                    options={genderOptions} 
                />

                <Text style={styles.label}>Nível de atividade física:</Text>
                <Select 
                    control={control} 
                    name="level" 
                    placeholder="Selecione seu nível de atividade física..." 
                    error={errors.level?.message} 
                    options={levelOptions} 
                />

                <Text style={styles.label}>Objetivo:</Text>
                <Select 
                    control={control} 
                    name="objective" 
                    placeholder="Selecione seu objetivo..." 
                    error={errors.objective?.message} 
                    options={objectiveOptions} 
                />

                <Text style={styles.label}>Possui alguma alergia? Se sim, quais:</Text>
                <Input
                    name="allergies"
                    control={control}
                    placeholder="Ex: lactose, amendoim..."
                    keyboardType="default"
                />

                <View style={styles.checkboxContainer}>
                    <Text style={styles.checkboxLabel}>É hipertenso?</Text>
                    <Switch 
                        value={hipertensive} 
                        onValueChange={setHipertensive} 
                        trackColor={{ false: colors.gray, true: colors.blue }}
                        thumbColor={colors.white}
                    />
                </View>

                <View style={styles.checkboxContainer}>
                    <Text style={styles.checkboxLabel}>É diabético?</Text>
                    <Switch 
                        value={diabetic} 
                        onValueChange={setDiabetic} 
                        trackColor={{ false: colors.gray, true: colors.blue }}
                        thumbColor={colors.white}
                    />
                </View>

                <Pressable style={styles.button} onPress={handleSubmit(handleCreate)}>
                    <Text style={styles.buttonText}>Avançar</Text>
                </Pressable>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    content: {
        paddingLeft: 16,
        paddingRight: 16
    },
    label: {
        fontSize: 16,
        color: colors.white,
        fontWeight: 'bold',
        marginBottom: 8
    },
    button: {
        backgroundColor: colors.blue,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold'
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        justifyContent: 'space-between'
    },
    checkboxLabel: {
        color: colors.white,
        fontSize: 16
    }
})