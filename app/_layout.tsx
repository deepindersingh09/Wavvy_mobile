import { Stack } from "expo-router";
import { PlayerProvider } from "../lib/playercontext";

export default function Layout() {
  return (
    <PlayerProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PlayerProvider>
  );
}
