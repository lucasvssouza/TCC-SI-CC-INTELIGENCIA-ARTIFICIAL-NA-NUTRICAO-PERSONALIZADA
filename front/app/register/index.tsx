import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { colors } from "@/constants/colors";
import { router } from "expo-router";
import { api } from "@/services/api";
import * as SecureStore from "expo-secure-store";
import { useDataStore } from "@/store/data";

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleRegister() {
    setErrorMessage(null) // limpa a mensagem ao tentar novamente

    try {
      const response = await api.post("/register", { name, email, password });
      const token = response.data.token
      const nameReturned = response.data.name

      if (token) {
        await SecureStore.setItemAsync("token", token)
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      }

      useDataStore.getState().setUser({ name: nameReturned })

      // se deu certo, redireciona
      router.replace("/step")
    } catch (error: any) {
      console.log("Erro no registro:", error)
      // tenta pegar mensagem do backend, se não tiver, coloca genérica
      const msg = error.response?.data?.message || "Não foi possível conectar ao servidor"
      setErrorMessage(msg)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie sua conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </Pressable>

      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      <Pressable onPress={() => router.push("/login")}>
        <Text style={styles.loginText}>Já possui uma conta? Faça o login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: colors.white,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.blue,
    width: "100%",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 12,
    textAlign: "center",
  },
  loginText: {
    color: colors.white,
    fontSize: 14,
    marginTop: 16,
    textDecorationLine: "underline",
  },
});
