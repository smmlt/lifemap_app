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
import { Picker } from "@react-native-picker/picker";
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
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [category, setCategory] = useState("Personal");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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
          setPriority(data.priority || "Low");
          setCategory(data.category || "Personal");
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
        priority,
        category,
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
    pickerInner: {
      height: 50,
      borderRadius: 10,
      color: "#000",
      backgroundColor: "#fff",
      paddingHorizontal: 10,
      width: '100%',
      marginBottom: 20,
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

      <Text style={styles.label}>Пріоритет</Text>
      <Picker
        selectedValue={priority}
        onValueChange={setPriority}
        style={styles.pickerInner}
        dropdownIconColor="#2196f3"
        mode="dropdown"
      >
        <Picker.Item label="High" value="high" />
        <Picker.Item label="Medium" value="medium" />
        <Picker.Item label="Low" value="low" />
      </Picker>

      <Text style={styles.label}>Категорія</Text>
      <Picker
        selectedValue={category}
        onValueChange={setCategory}
        style={styles.pickerInner}
        dropdownIconColor="#2196f3"
        mode="dropdown"
      >
        <Picker.Item label="Work" value="Work" />
        <Picker.Item label="Personal" value="Personal" />
        <Picker.Item label="Study" value="Study" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <TouchableOpacity style={styles.Button} onPress={save} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.ButtonText}>Зберегти</Text>}
      </TouchableOpacity>
    </View>
  );
}