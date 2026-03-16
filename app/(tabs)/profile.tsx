import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { auth } from "@/constants/FirebaseConfig";
import { signOut } from "firebase/auth";


export default function ProfileScreen() {

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 25,
            paddingTop: 60
        },
        email: {
            fontSize: 18,
            marginBottom: 20,
        },
        logout: {
            backgroundColor: "#ff0000",
            padding: 15,
            borderRadius: 10,
            width: '80%',
            alignItems: "center",
            justifyContent: "center",
        },
        buttonText: {
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
            alignItems: "center",
        }
    })

    return (
            <View style={styles.container}>
                <Text style={styles.email}>
                    {auth.currentUser?.email}
                </Text>
                <TouchableOpacity style={styles.logout} onPress={() => signOut(auth)}>
                    <Text style={styles.buttonText}>Вийти</Text>
                </TouchableOpacity>
            </View>
        )
}