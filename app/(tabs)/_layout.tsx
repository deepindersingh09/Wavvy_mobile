import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1A3164",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#eee",
          height: 70,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "500",
          marginTop: -5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={27} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          tabBarLabel: "Your Library",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="library-shelves" color={color} size={26} />
          ),
        }}
      />
      

      <Tabs.Screen
        name="create"
        options={{
          tabBarLabel: "Create",
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus" color={color} size={29} />
          ),
        }}
      />
    </Tabs>
  );
}
