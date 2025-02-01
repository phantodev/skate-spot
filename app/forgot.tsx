import { useEffect, useState } from "react";
import {
	Alert,
	View,
	Text,
	TextInput,
	Pressable,
	ScrollView,
	SafeAreaView,
	ActivityIndicator,
	StyleSheet,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import type { TStatus } from "@/types/global";
import Toast from "react-native-toast-message";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function SignupScreen() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<TStatus>("idle");
	const [errorMessage, setErrorMessage] = useState("");

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setErrorMessage("");
	}, [email]);

	async function handleForgotPassword() {
		setStatus("loading");

		if (email === "") {
			Toast.show({
				type: "error",
				text1: "Erro no cadastro",
				text2: "Email é obrigatório",
			});
			setStatus("error");
			return;
		}

		await sendPasswordResetEmail(auth, email.trim());

		Toast.show({
			type: "success",
			text1: "Sucesso",
			text2: "Senha recuperada com sucesso!",
		});
		setStatus("success");
		router.push("/");
	}

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.safeArea}>
				<ScrollView style={styles.scrollView}>
					<View style={styles.container}>
						<Text style={styles.title}>Esqueci minha senha</Text>
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Email</Text>
							<TextInput
								keyboardType="email-address"
								onChangeText={setEmail}
								style={styles.input}
							/>
						</View>
						<Pressable
							style={[
								styles.button,
								errorMessage ? styles.errorButton : styles.defaultButton,
							]}
							onPress={handleForgotPassword}
						>
							{status === "loading" ? (
								<ActivityIndicator color={"white"} />
							) : (
								<Text style={styles.buttonText}>
									{errorMessage ? errorMessage : "Recuperar senha"}
								</Text>
							)}
						</Pressable>
					</View>
				</ScrollView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		paddingTop: 32,
	},
	scrollView: {
		width: "100%",
	},
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 40,
	},
	title: {
		fontSize: 30,
		color: "#eab308",
	},
	inputContainer: {
		width: "100%",
		marginTop: 16,
	},
	label: {
		fontSize: 20,
		color: "white",
	},
	input: {
		backgroundColor: "#27272a",
		width: "100%",
		borderRadius: 8,
		color: "white",
		paddingHorizontal: 16,
	},
	button: {
		marginTop: 24,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 6,
		width: "100%",
		height: 48,
		justifyContent: "center",
		alignItems: "center",
	},
	defaultButton: {
		backgroundColor: "#eab308",
	},
	errorButton: {
		backgroundColor: "#ef4444",
	},
	buttonText: {
		fontSize: 20,
		color: "white",
	},
});
