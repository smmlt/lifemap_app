// app/edit.tsx
import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../constants/FirebaseConfig";

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(""); // збережемо як рядок для простоти
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Завантаження існуючого завдання
  useEffect(() => {
    if (id) {
      getDoc(doc(db, "tasks", id)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setTitle(data.title);
          setDescription(data.description || "");
          setDueDate(
            data.dueDate?.toDate ? data.dueDate.toDate().toISOString().slice(0, 16) : ""
          );
        }
      });
    }
  }, [id]);

  const save = async () => {
    if (!title) {
      alert("Будь ласка, введіть назву завдання");
      return;
    }
    setLoading(true);

    try {
      const data = {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        updatedAt: serverTimestamp(),
      };

      if (id) {
        await updateDoc(doc(db, "tasks", id), data);
      } else {
        await addDoc(collection(db, "tasks"), {
          ...data,
          completed: false,
          userId: auth.currentUser?.uid,
          createdAt: serverTimestamp(),
        });
      }

      router.replace("/(tabs)");
    } catch (err: any) {
      alert(`Помилка при збереженні завдання: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 25,
      paddingTop: 60,
      backgroundColor: "#f5f5f5",
    },
    label: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 10,
      padding: 15,
      marginBottom: 20,
      fontSize: 18,
      backgroundColor: "#fff",
    },
    Button: {
      backgroundColor: "#2196f3",
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
    },
    ButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{id ? "Редагувати завдання" : "Додати нове завдання"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Назва завдання"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Опис"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Дедлайн (YYYY-MM-DDTHH:MM)"
        value={dueDate}
        onChangeText={setDueDate}
      />

      <TouchableOpacity style={styles.Button} onPress={save} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.ButtonText}>Зберегти</Text>}
      </TouchableOpacity>
    </View>
  );
}