import { Stack } from "expo-router";

import { StatusBar } from "react-native";

export default function LocationLayout() {
  return (
    <>
    
    
    
   <StatusBar barStyle="light-content" />
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Toyota Prado 2017",
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "#182f51",
        },
      }}
    />
      </>
  );
}
