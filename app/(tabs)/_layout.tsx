import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const defaultTheme = "dark";

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme || defaultTheme].tint,
				tabBarButton: HapticTab,
				headerShown: false,
				tabBarBackground: TabBarBackground,
				tabBarStyle: Platform.select({
					ios: {
						// Use a transparent background on iOS to show the blur effect
						position: "absolute",
						backgroundColor: Colors[colorScheme || defaultTheme].background,
					},
					default: {
						backgroundColor: Colors[colorScheme || defaultTheme].background,
					},
				}),
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="house.fill" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					title: "Explore",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="paperplane.fill" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="my-profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color }) => (
						<AntDesign name="user" size={28} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
