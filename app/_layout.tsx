import { SplashScreen, Stack } from "expo-router";
import '../global.css'
import {useFonts} from'expo-font'
import { useEffect } from "react";
import TimerProvider from "@/context/TimerContext";

// prevent the splash screen from auto hiding until all the font assets are loaded
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Roboto-Mono": require("../assets/fonts/RobotoMono-Regular.ttf"),
});

useEffect(() => {
  if (error) throw error
  if (fontsLoaded) SplashScreen.hideAsync()
}, [fontsLoaded, error])

if (!fontsLoaded) return null
if (!fontsLoaded && error) return null

  return (
    <TimerProvider>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index"/>
        <Stack.Screen name="(tabs)"/>
        <Stack.Screen name="meditate/[id]"/>
        <Stack.Screen name="(modal)/adjust-meditation-duration" options={{presentation: 'modal'}}/>
      </Stack>
    </TimerProvider>
);
}
