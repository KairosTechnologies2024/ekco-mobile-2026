import { Stack } from 'expo-router';

export default function TicketsLayout() {
  return (
    <Stack>
      <Stack.Screen name="view" options={{ title: 'Tickets > View > All' }} />
      <Stack.Screen name="log" options={{ title: 'Tickets > Log' }} />
      <Stack.Screen name="chat" options={{ title: 'Tickets > Chat' }} />
    </Stack>
  );
}
