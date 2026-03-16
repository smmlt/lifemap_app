// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   RefreshControl,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import { db, auth } from "../../constants/FirebaseConfig";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   deleteDoc,
//   doc,
//   orderBy,
//   updateDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter, Stack } from "expo-router";

// export default function TasksScreen() {
//   const [tasks, setTasks] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [sortBy, setSortBy] = useState<"dueDate" | "title">("dueDate");
//   const router = useRouter();

//   const fetchTasks = async () => {
//     if (!auth.currentUser) return;
//     setLoading(true);
//     try {
//       const q = query(
//         collection(db, "tasks"),
//         where("userId", "==", auth.currentUser.uid),
//         orderBy(sortBy, "asc")
//       );
//       const querySnapshot = await getDocs(q);
//       const data = querySnapshot.docs.map((d) => ({
//         id: d.id,
//         ...d.data(),
//       }));
//       setTasks(data);
//     } catch (err) {
//       console.error("Error fetching tasks:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = (id: string) => {
//     Alert.alert(
//       "Підтвердження",
//       "Ви впевнені, що хочете видалити це завдання?",
//       [
//         { text: "Скасувати", style: "cancel" },
//         {
//           text: "Видалити",
//           onPress: async () => {
//             await deleteDoc(doc(db, "tasks", id));
//             setTasks((prev) => prev.filter((t) => t.id !== id));
//           },
//         },
//       ]
//     );
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         fetchTasks();
//       } else {
//         setTasks([]);
//       }
//     });
//     return unsubscribe;
//   }, []);

//   // Перезапит при зміні сортування
//   useEffect(() => {
//     fetchTasks();
//   }, [sortBy]);

//   const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
//     itemStyle: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       padding: 15,
//       backgroundColor: "#fff",
//       marginVertical: 5,
//       borderRadius: 8,
//     },
//     textContainer: { flex: 1, paddingRight: 10 },
//     title: { fontSize: 18, fontWeight: "bold" },
//     description: { color: "#666" },
//     dueDate: { color: "#999", fontSize: 12, marginTop: 3 },
//     sortButton: { fontWeight: "bold", fontSize: 16 },
//     sortContainer: {
//       flexDirection: "row",
//       justifyContent: "space-around",
//       marginVertical: 10,
//     },
//     completedIcon: { marginRight: 10 },
//   });

//   return (
//     <View style={styles.container}>
//       <Stack.Screen
//         options={{
//           title: "Завдання",
//           headerRight: () => (
//             <TouchableOpacity onPress={() => router.push("../edit")}>
//               <Ionicons name="add-circle" size={30} color="#2196f3" />
//             </TouchableOpacity>
//           ),
//         }}
//       />

//       {/* Кнопки сортування */}
//       <View style={styles.sortContainer}>
//         <TouchableOpacity onPress={() => setSortBy("dueDate")}>
//           <Text
//             style={[
//               styles.sortButton,
//               { color: sortBy === "dueDate" ? "#2196f3" : "#666" },
//             ]}
//           >
//             За датою
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => setSortBy("title")}>
//           <Text
//             style={[
//               styles.sortButton,
//               { color: sortBy === "title" ? "#2196f3" : "#666" },
//             ]}
//           >
//             За назвою
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={tasks}
//         keyExtractor={(item) => item.id}
//         refreshControl={
//           <RefreshControl refreshing={loading} onRefresh={fetchTasks} />
//         }
//         renderItem={({ item }) => (
//           <View style={styles.itemStyle}>
//             <TouchableOpacity
//               style={styles.textContainer}
//               onPress={() =>
//                 router.push({
//                   pathname: "../edit",
//                   params: { id: item.id },
//                 })
//               }
//             >
//               <Text style={styles.title}>{item.title}</Text>
//               {item.description ? (
//                 <Text style={styles.description}>{item.description}</Text>
//               ) : null}
//               {item.dueDate ? (
//                 <Text style={styles.dueDate}>
//                   {item.dueDate.toDate
//                     ? item.dueDate.toDate().toLocaleString()
//                     : ""}
//                 </Text>
//               ) : null}
//             </TouchableOpacity>

//             {/* Completed */}
//             <TouchableOpacity
//               style={styles.completedIcon}
//               onPress={async () => {
//                 await updateDoc(doc(db, "tasks", item.id), {
//                   completed: !item.completed,
//                   updatedAt: serverTimestamp(),
//                 });
//                 setTasks((prev) =>
//                   prev.map((t) =>
//                     t.id === item.id
//                       ? { ...t, completed: !t.completed }
//                       : t
//                   )
//                 );
//               }}
//             >
//               <Ionicons
//                 name={item.completed ? "checkmark-circle" : "ellipse-outline"}
//                 size={24}
//                 color={item.completed ? "green" : "#888"}
//               />
//             </TouchableOpacity>

//             {/* Видалення */}
//             <TouchableOpacity onPress={() => handleDelete(item.id)}>
//               <Ionicons name="trash-outline" size={22} color="red" />
//             </TouchableOpacity>
//           </View>
//         )}
//         ListEmptyComponent={
//           !loading ? (
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center",
//                 marginTop: 50,
//               }}
//             >
//               <Text style={{ fontSize: 18, color: "#666" }}>Немає завдань</Text>
//             </View>
//           ) : null
//         }
//       />

//       {loading && (
//         <Text style={{ textAlign: "center", marginTop: 10 }}>Завантаження...</Text>
//       )}
//     </View>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { db, auth } from "../../constants/FirebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Stack } from "expo-router";

export default function TasksScreen() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"dueDate" | "title">("dueDate");
  const [searchText, setSearchText] = useState(""); // новий стан пошуку
  const [filterCompleted, setFilterCompleted] = useState<"all" | "done" | "notdone">("all");
  const router = useRouter();

  const fetchTasks = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "tasks"),
        where("userId", "==", auth.currentUser.uid),
        orderBy(sortBy, "asc")
      );
      const querySnapshot = await getDocs(q);
      let data = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      data = data.filter((t: any) =>
        t.title.toLowerCase().includes(searchText.toLowerCase())
      );

      if (filterCompleted === "done") {
        data = data.filter((t: any) => t.completed);
      } else if (filterCompleted === "notdone") {
        data = data.filter((t: any) => !t.completed);
      }

      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Підтвердження",
      "Ви впевнені, що хочете видалити це завдання?",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          onPress: async () => {
            await deleteDoc(doc(db, "tasks", id));
            setTasks((prev) => prev.filter((t) => t.id !== id));
          },
        },
      ]
    );
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) fetchTasks();
      else setTasks([]);
    });
    return unsubscribe;
  }, []);

  // Перезапит при зміні сортування, пошуку або фільтру
  useEffect(() => {
    fetchTasks();
  }, [sortBy, searchText, filterCompleted]);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
    itemStyle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 15,
      backgroundColor: "#fff",
      marginVertical: 5,
      borderRadius: 8,
    },
    textContainer: { flex: 1, paddingRight: 10 },
    title: { fontSize: 18, fontWeight: "bold" },
    description: { color: "#666" },
    dueDate: { color: "#999", fontSize: 12, marginTop: 3 },
    sortButton: { fontWeight: "bold", fontSize: 16 },
    sortContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 10,
    },
    completedIcon: { marginRight: 10 },
    searchInput: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      fontSize: 16,
      backgroundColor: "#fff",
    },
    filterContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 10,
    },
    filterButton: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
    },
    filterText: { fontWeight: "bold", fontSize: 14 },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Завдання",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("../edit")}>
              <Ionicons name="add-circle" size={30} color="#2196f3" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Пошук */}
      <TextInput
        placeholder="Пошук за назвою..."
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Фільтр по completed */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterCompleted("all")}
        >
          <Text style={[styles.filterText, { color: filterCompleted === "all" ? "#2196f3" : "#666" }]}>
            Всі
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterCompleted("done")}
        >
          <Text style={[styles.filterText, { color: filterCompleted === "done" ? "#2196f3" : "#666" }]}>
            Виконані
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterCompleted("notdone")}
        >
          <Text style={[styles.filterText, { color: filterCompleted === "notdone" ? "#2196f3" : "#666" }]}>
            Невиконані
          </Text>
        </TouchableOpacity>
      </View>

      {/* Сортування */}
      <View style={styles.sortContainer}>
        <TouchableOpacity onPress={() => setSortBy("dueDate")}>
          <Text style={[styles.sortButton, { color: sortBy === "dueDate" ? "#2196f3" : "#666" }]}>
            За датою
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy("title")}>
          <Text style={[styles.sortButton, { color: sortBy === "title" ? "#2196f3" : "#666" }]}>
            За назвою
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchTasks} />}
        renderItem={({ item }) => (
          <View style={styles.itemStyle}>
            <TouchableOpacity
              style={styles.textContainer}
              onPress={() => router.push({ pathname: "../edit", params: { id: item.id } })}
            >
              <Text style={styles.title}>{item.title}</Text>
              {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
              {item.dueDate ? (
                <Text style={styles.dueDate}>
                  {item.dueDate.toDate ? item.dueDate.toDate().toLocaleString() : ""}
                </Text>
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.completedIcon}
              onPress={async () => {
                await updateDoc(doc(db, "tasks", item.id), {
                  completed: !item.completed,
                  updatedAt: serverTimestamp(),
                });
                setTasks((prev) =>
                  prev.map((t) => (t.id === item.id ? { ...t, completed: !t.completed } : t))
                );
              }}
            >
              <Ionicons
                name={item.completed ? "checkmark-circle" : "ellipse-outline"}
                size={24}
                color={item.completed ? "green" : "#888"}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash-outline" size={22} color="red" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 }}>
              <Text style={{ fontSize: 18, color: "#666" }}>Немає завдань</Text>
            </View>
          ) : null
        }
      />

      {loading && <Text style={{ textAlign: "center", marginTop: 10 }}>Завантаження...</Text>}
    </View>
  );
}