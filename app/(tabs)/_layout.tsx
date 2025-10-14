
// TabsLayout.tsx
import { Entypo } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useMemo } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { enableScreens } from "react-native-screens";
import { useSelector } from "react-redux";
import { useGetAlertsBySerialQuery } from "../../store/api/authApi";
import { RootState } from "../../store/store";

export default function TabsLayout() {
  enableScreens();

  const storeVehicles = useSelector((state: RootState) => state.user.vehicles) ?? [];
  const vehiclesWithSerial = useMemo(() =>
    (Array.isArray(storeVehicles) && storeVehicles.length > 0)
      ? storeVehicles.filter((v: any) => v.serial)
      : [],
    [storeVehicles]
  );

  // Fetch alerts for all vehicles with serials
  const alertsQueries = vehiclesWithSerial.map(vehicle =>
    useGetAlertsBySerialQuery(vehicle.serial, { skip: !vehicle.serial })
  );

  // Calculate total critical alerts
  const criticalCount = useMemo(() =>
    alertsQueries.reduce((total, query) => {
      if (query.data) {
        const alerts = query.data.alerts ?? query.data.data ?? (Array.isArray(query.data) ? query.data : []);
        if (Array.isArray(alerts)) {
          const critical = alerts.filter((alert: any) => {
            const type = (alert.alert ?? alert.alertType ?? '').toString().toLowerCase();
            return type.endsWith('detected') || type.endsWith('disconnected') || type.includes('disconnected') || type.includes('smash') || type.includes('jamming');
          });
          return total + critical.length;
        }
      }
      return total;
    }, 0),
    [alertsQueries]
  );

  return (
<>
    <StatusBar barStyle="dark-content" />
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#182f51',
          borderTopWidth: 0.2,
          borderTopColor: '#cccccc',
        },
        headerStyle: {
          backgroundColor: '#f0f0f0',
        },
        headerTintColor: '#333333',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown:false,
          tabBarShowLabel:true,
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#333333',
          },
          tabBarIcon: ({ color, size }) => (
            <Entypo name="location-pin" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          tabBarShowLabel: true,
          headerShown: true,
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Live Alerts</Text>
              <Text style={{ fontSize: 14, color: 'red', marginLeft: 4 }}>({criticalCount})</Text>
            </View>
          ),
          tabBarLabel: "Alerts",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="sound" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: "Trips",
          headerShown: true,
          tabBarShowLabel: true,
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333333',
          },
          tabBarLabel: "Trips",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="aircraft-take-off" size={size} color={color} />
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
              <TouchableOpacity
                style={{ marginRight: 15, padding: 5 }}
                onPress={() => {
                  // This will be handled by the trips screen
                  // We can use a ref or callback to trigger the export
                }}
              >
                <Entypo name="download" size={20} color="#059669" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: 5 }}
                onPress={() => {
                  // This will be handled by the trips screen
                }}
              >
                <Entypo name="document" size={20} color="#DC2626" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Tabs>
    </>
  );
}
