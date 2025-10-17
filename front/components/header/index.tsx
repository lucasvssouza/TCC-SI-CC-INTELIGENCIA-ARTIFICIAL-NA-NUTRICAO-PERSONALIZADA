import { View, Text, StyleSheet, Pressable, SafeAreaView, StatusBar, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { router } from "expo-router";

interface HeaderProps {
    step: string;
    title: string;
    showBackButton?: boolean;
}

export function Header({ step, title, showBackButton = true }: HeaderProps) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.row}>
                    {showBackButton && ( // 👈 só mostra se showBackButton for true
                        <Pressable onPress={() => router.back()}>
                            <Feather name="arrow-left" size={24} color="#000" />
                        </Pressable>
                    )}
                    <Text style={styles.text}>
                        {step}
                    </Text>
                </View>

                <Text style={styles.title}>
                    {title}
                </Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderBottomRightRadius: 14,
        borderBottomLeftRadius: 14,
        marginBottom: 14,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 34 : 34
    },
    content: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 34,
        borderBottomRightRadius: 14,
        borderBottomLeftRadius: 14
    },
    row: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center'
    },
    text: {
        fontSize: 18
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.background
    }
})