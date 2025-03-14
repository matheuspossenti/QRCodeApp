import { Stack } from "expo-router";

export default function Layout() {
  // Slot vai renderizar o conteúdo da atual rota. Podemos por exemplo criar um header e um footer fixos
  // e deixar o conteúdo da rota no Slot
  return (
    <Stack initialPath="/">
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen name="historico" options={{ title: "Histórico" }} />
    </Stack>
  );
}
