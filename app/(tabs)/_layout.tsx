// app/tabs/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2196f3",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#eee",
          height: 55,
        },
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
        headerShadowVisible: false,
      }}
    >
      {/** Вкладка "Завдання" */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Завдання",
          tabBarLabel: "Завдання",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />

      {/** Можлива друга вкладка для статистики або іншого */}
      {/* 
      <Tabs.Screen
        name="stats"
        options={{
          title: "Статистика",
          tabBarLabel: "Статистика",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      /> 
      */}
    </Tabs>
  );
}