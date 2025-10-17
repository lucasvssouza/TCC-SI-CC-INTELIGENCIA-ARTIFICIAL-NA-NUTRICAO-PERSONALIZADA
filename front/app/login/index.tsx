import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { colors } from "@/constants/colors";
import { router } from "expo-router";
import { api } from "@/services/api";

import * as SecureStore from "expo-secure-store";
import { useDataStore } from "@/store/data";

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleLogin() {
    setErrorMessage(null); // limpa a mensagem ao tentar novamente

    try {
      const response = await api.post("/login", { email, password })

      const token = response.data.token
      const name = response.data.name

      await SecureStore.setItemAsync("token", token)

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      useDataStore.getState().setUser({ name })

      // Se deu certo, redireciona para a tela /step
      router.replace("/step")
    } catch (error: any) {
      console.log("Erro no login:", error)

      // Pega a mensagem do backend ou coloca uma genérica
      const msg = error.response?.data?.message || "Usuário e/ou senha inválidos"
      setErrorMessage(msg)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faça seu login</Text>

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

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </Pressable>

      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      <Pressable onPress={() => router.push("/register")}>
        <Text style={styles.registerText}>Não possui conta? Cadastre-se</Text>
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
  registerText: {
    color: colors.white,
    fontSize: 14,
    marginTop: 16,
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
