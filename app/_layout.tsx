import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<>
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<Stack>
					<Stack.Screen name="index" options={{ headerShown: false }} />
					<Stack.Screen name="forgot" options={{ headerShown: false }} />
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen name="+not-found" />
				</Stack>
			</ThemeProvider>
			<StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
			<Toast 
				config={{
					success: (props) => (
						<BaseToast
							{...props}
							style={{ 
								borderLeftColor: '#28a745',
								backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff'
							}}
							contentContainerStyle={{ 
								backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff'
							}}
							text1Style={{
								color: colorScheme === 'dark' ? '#fff' : '#000'
							}}
							text2Style={{
								color: colorScheme === 'dark' ? '#d1d1d1' : '#666'
							}}
						/>
					),
					error: (props) => (
						<ErrorToast
							{...props}
							style={{ 
								borderLeftColor: '#dc3545',
								backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff'
							}}
							contentContainerStyle={{ 
								backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff'
							}}
							text1Style={{
								color: colorScheme === 'dark' ? '#fff' : '#000'
							}}
							text2Style={{
								color: colorScheme === 'dark' ? '#d1d1d1' : '#666'
							}}
						/>
					),
				}}
			/>
		</>
	);
}
