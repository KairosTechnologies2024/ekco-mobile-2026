import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "react-native";

export default function LocationLayout() {
  const { vehicle } = useLocalSearchParams();
  let vehicleData;
  try {
    vehicleData = vehicle ? JSON.parse(vehicle as string) : { name: 'Unknown Vehicle' };
  } catch (error) {
    vehicleData = { name: 'Unknown Vehicle' };
  }

  return (
    <>



   <StatusBar barStyle="light-content" />
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: vehicleData.name,
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "#182f51",
        },
      }}
    />
      </>
  );
}
