import React, { useState } from "react";

import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { auth } from "@/constants/FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import { useRouter } from "expo-router";


export default function AuthScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const [loading, setLoading] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);

    const router = useRouter();

    const handleAuth = async () => {

        if (!email || !password) {
            alert("Будь ласка, введіть email та пароль");
            return;
        }
        setLoading(true);

        try{
            if (isLoginMode) {
                await signInWithEmailAndPassword(auth, email, password);
                alert("Успішний вхід!");
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                alert("Аккаунт успішно створено!");
            }
            router.replace("/(tabs)");
        }
        catch (err: any) {
            let message = "Сталась помилка. Спробуйте ще раз.";
            if (err.code === "auth/email-already-in-use") {
                message = "Цей email вже використовується.";
            } 
            if (err.code === "auth/invalid-email") {
                message = "Невірний формат email.";
            }
            if (err.code === "auth/weak-password") {
                message = "Пароль має бути не менше 6 символів.";
            }
            if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
                message = "Невірний email або пароль.";
            }
            alert(message);
        }
        finally {
            setLoading(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            backgroundColor: "#f5f5f5",
        },

        form: {
            width: "100%",
            marginBottom: 20,
        },

        title: {
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
            marginTop: -10,
        },

        input: {
            width: "100%",
            height: 50,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingRight: 45,
            marginVertical: 10,
            backgroundColor: "#fff",
        },

        passwordContainer: {
            width: "100%",
            justifyContent: "center",
        },

        eye: {
            position: "absolute",
            right: 15,
        },

        button: {
        width: "100%",
        height: 50,
        backgroundColor: "#4a90e2",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginTop: 10,
        },

        buttonText: {
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
        },

        switchBtn: {
            marginTop: 20,
        },

        switchText: {
            color: "#4a90e2",
            marginTop: 15,
            fontSize: 16,
            textAlign: "center",
        },
    });

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                {isLoginMode ? "Увійти в аккаунт" : "Створити аккаунт"}
            </Text>

            <View style={styles.form} >

                <TextInput
                style={styles.input}
                placeholder="Ваш email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Пароль"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />

                    <TouchableOpacity
                        style={styles.eye}
                        onPress={() => setShowPassword(prev => !prev)}
                    >
                        <Text>👁</Text>
                    </TouchableOpacity>
                </View>

            </View>
            

            <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" /> 
                ) : (
                    <Text style={styles.buttonText}>
                        {isLoginMode ? "Увійти" : "Зареєструватися"}
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.switchBtn} onPress={() => setIsLoginMode(!isLoginMode)}>
                <Text style={styles.switchText}>
                    {isLoginMode ? "Немає аккаунту? Створити" : "Вже є аккаунт? Увійти"}
                </Text>
            </TouchableOpacity>

        </View>
    );

    
}
