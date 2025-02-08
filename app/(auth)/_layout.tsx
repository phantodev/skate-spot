import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { createContext, useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import type { Spot } from "../(tabs)";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

interface MainContextType {
	isFetchingSpots: boolean;
	setFetchingSpots: React.Dispatch<React.SetStateAction<boolean>>;
	tempSpots: Spot;
	setTempSpots: React.Dispatch<React.SetStateAction<Spot>>;
}

export const MainContext = createContext<MainContextType>({
	isFetchingSpots: false,
	setFetchingSpots: () => {},
	tempSpots: {} as Spot,
	setTempSpots: () => {},
});

export default function RootLayout() {
	const [isFetchingSpots, setFetchingSpots] = useState(false);
	const [tempSpots, setTempSpots] = useState({} as Spot);
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
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
			<ActionSheetProvider>
				<MainContext.Provider
					value={{ isFetchingSpots, setFetchingSpots, tempSpots, setTempSpots }}
				>
					<ThemeProvider
						value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
					>
						<Stack>
							<Stack.Screen name="index" options={{ headerShown: false }} />
							<Stack.Screen name="forgot" options={{ headerShown: false }} />
							<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
							<Stack.Screen 
								name="addSpotPhoto/[id]" 
								options={{ 
									title: "Adicionar Fotos",
									headerStyle: {
										backgroundColor: "#18181b",
									},
									headerTintColor: "#fff",
									headerTitleStyle: {
										fontWeight: "bold",
									},
								}} 
							/>
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
										borderLeftColor: "#28a745",
										backgroundColor:
											colorScheme === "dark" ? "#1a1a1a" : "#fff",
									}}
									contentContainerStyle={{
										backgroundColor:
											colorScheme === "dark" ? "#1a1a1a" : "#fff",
									}}
									text1Style={{
										color: colorScheme === "dark" ? "#fff" : "#000",
									}}
									text2Style={{
										color: colorScheme === "dark" ? "#d1d1d1" : "#666",
									}}
								/>
							),
							error: (props) => (
								<ErrorToast
									{...props}
									style={{
										borderLeftColor: "#dc3545",
										backgroundColor:
											colorScheme === "dark" ? "#1a1a1a" : "#fff",
									}}
									contentContainerStyle={{
										backgroundColor:
											colorScheme === "dark" ? "#1a1a1a" : "#fff",
									}}
									text1Style={{
										color: colorScheme === "dark" ? "#fff" : "#000",
									}}
									text2Style={{
										color: colorScheme === "dark" ? "#d1d1d1" : "#666",
									}}
								/>
							),
						}}
					/>
				</MainContext.Provider>
			</ActionSheetProvider>
		</>
	);
}
