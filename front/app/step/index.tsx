import { View, Text, Image, StyleSheet, Pressable, ScrollView } from 'react-native'
import { colors } from '@/constants/colors'
import { router } from 'expo-router'

import { Header } from '../../components/header'
import { Input } from '@/components/input'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useEffect } from 'react'

import { useDataStore } from '@/store/data'

import * as SecureStore from "expo-secure-store";
import { api } from '@/services/api'


const schema = z.object({
    name: z.string().min(1, { message: "O nome é obrigatório" }),
    weight: z.string().min(1, { message: "O peso é obrigatório" }),
    age: z.string().min(1, { message: "A idade é obrigatória" }),
    height: z.string().min(1, { message: "A altura é obrigatória" })
})

type FormData = z.infer<typeof schema>

export default function Step() {
    useEffect(() => {
        async function checkAuth() {
            const token = await SecureStore.getItemAsync("token")

            if (!token) {
                router.replace("/")
            } else {
                // setar axios header se o app foi reiniciado
                api.defaults.headers.common["Authorization"] = `Bearer ${token}`
            }
        }

        checkAuth()
    }, [])

    const { control, handleSubmit, formState: { errors, isValid }, setValue } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    const user = useDataStore(state => state.user)

    const setPageOne = useDataStore(state => state.setPageOne)

    useEffect(() => {
        if (user.name) {
            setValue("name", user.name)
        }
    }, [user.name, setValue])

    // função de logout
    async function handleLogout() {
        try {
            // remove token seguro
            await SecureStore.deleteItemAsync("token")

            // remove header default do axios (se estiver usando axios)
            if (api && api.defaults && api.defaults.headers) {
                delete api.defaults.headers.common["Authorization"]
            }

            router.replace("/")
        } catch (e) {
            console.log("Erro ao deslogar:", e)
            router.replace("/") // Redireciona para a home mesmo se der erro
        }
    }

    function handleCreate(data: FormData) {
        setPageOne({
            name: data.name,
            weight: data.weight,
            age: data.age,
            height: data.height,
            hipertensive: false,
            diabetic: false,
            allergies: ''
        })
        
        router.push("/create")
    }

    return (
        <View style={styles.container}>
            <Header step="Passo 1" title="Vamos começar" showBackButton={false} />
            <ScrollView style={styles.content}>
                <Text style={styles.label}>Nome: {user.name}</Text>
                {/* <Input 
                    name="name" 
                    control={control} 
                    placeholder="Digite seu nome..." 
                    error={errors.name?.message} 
                    keyboardType="default" 
                /> */}

                <Text style={styles.label}>Seu peso atual:</Text>
                <Input 
                    name="weight" 
                    control={control} 
                    placeholder="Ex: 75" 
                    error={errors.weight?.message} 
                    keyboardType="numeric" 
                />

                <Text style={styles.label}>Sua altura atual:</Text>
                <Input 
                    name="height" 
                    control={control} 
                    placeholder="Ex: 1.80" 
                    error={errors.height?.message} 
                    keyboardType="numeric" 
                />

                <Text style={styles.label}>Sua idade atual:</Text>
                <Input 
                    name="age" 
                    control={control} 
                    placeholder="Ex: 27" 
                    error={errors.age?.message} 
                    keyboardType="numeric" 
                />

                <Pressable style={styles.button} onPress={handleSubmit(handleCreate)}>
                    <Text style={styles.buttonText}>Avançar</Text>
                </Pressable>

                <Pressable
                    style={[styles.button, styles.logoutButton]}
                    onPress={handleLogout}
                >
                    <Text style={styles.buttonText}>Sair</Text>
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
    logoutButton: {
        marginTop: 12,
        backgroundColor: "#555"
    }
})