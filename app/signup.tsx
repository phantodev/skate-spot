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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./../firebaseConfig";
import type { TStatus } from "@/types/global";
import Toast from "react-native-toast-message";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function SignupScreen() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [age, setAge] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [status, setStatus] = useState<TStatus>("idle");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		setErrorMessage("");
	}, [name, email, age, password, confirmPassword, city, state]);

	async function handleSignUp() {
		setStatus("loading");

		if (!email?.trim() || !password?.trim()) {
			Toast.show({
				type: "error",
				text1: "Erro no cadastro",
				text2: "Email e senha são obrigatórios",
			});
			setStatus("error");
			return;
		}

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email.trim(),
				password.trim(),
			);

			const userData = {
				name: String(name || "").trim(),
				email: String(email || "").trim(),
				age: String(age || "").trim(),
				city: String(city || "").trim(),
				state: String(state || "").trim(),
				userId: String(userCredential.user.uid),
				createdAt: new Date().toISOString(),
			};

			await addDoc(collection(db, "users"), userData);

			Toast.show({
				type: "success",
				text1: "Sucesso",
				text2: "Cadastro realizado com sucesso!",
			});
			setStatus("success");
			router.push("/");
		} catch (error: any) {
			let errorMsg = "Erro ao realizar cadastro";

			if (error?.code === "auth/email-already-in-use") {
				errorMsg = "Este email já está em uso";
			} else if (error?.code === "auth/invalid-email") {
				errorMsg = "Email inválido";
			} else if (error?.code === "auth/weak-password") {
				errorMsg = "Senha muito fraca";
			}

			setErrorMessage(errorMsg);

			Toast.show({
				type: "error",
				text1: "Erro no cadastro",
				text2: errorMsg,
			});
			setStatus("error");
		}
	}

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.safeArea}>
				<ScrollView style={styles.scrollView}>
					<View style={styles.container}>
						<Text style={styles.title}>Cadastro</Text>
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Nome</Text>
							<TextInput
								onChangeText={setName}
								style={styles.input}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Email</Text>
							<TextInput
								keyboardType="email-address"
								onChangeText={setEmail}
								style={styles.input}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Idade</Text>
							<TextInput
								keyboardType="numeric"
								onChangeText={setAge}
								style={styles.input}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Cidade</Text>
							<TextInput
								onChangeText={setCity}
								style={styles.input}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Estado</Text>
							<TextInput
								onChangeText={setState}
								style={styles.input}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Senha</Text>
							<TextInput
								secureTextEntry
								onChangeText={setPassword}
								style={styles.input}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Confirmar Senha</Text>
							<TextInput
								secureTextEntry
								onChangeText={setConfirmPassword}
								style={styles.input}
							/>
						</View>
						<Pressable
							style={[styles.button, errorMessage ? styles.errorButton : styles.defaultButton]}
							onPress={handleSignUp}
						>
							{status === "loading" ? (
								<ActivityIndicator color={"white"} />
							) : (
								<Text style={styles.buttonText}>
									{errorMessage ? errorMessage : "Cadastrar"}
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
		width: '100%',
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 40,
	},
	title: {
		fontSize: 30,
		color: '#eab308',
	},
	inputContainer: {
		width: '100%',
		marginTop: 16,
	},
	label: {
		fontSize: 20,
		color: 'white',
	},
	input: {
		backgroundColor: '#27272a',
		width: '100%',
		borderRadius: 8,
		color: 'white',
		paddingHorizontal: 16,
	},
	button: {
		marginTop: 24,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 6,
		width: '100%',
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
	},
	defaultButton: {
		backgroundColor: '#eab308',
	},
	errorButton: {
		backgroundColor: '#ef4444',
	},
	buttonText: {
		fontSize: 20,
		color: 'white',
	},
});
