import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import {
	View,
	Text,
	Pressable,
	TextInput,
	Alert,
	StyleSheet,
	TouchableHighlight,
	ActivityIndicator,
} from "react-native";
import { auth } from "../../firebaseConfig";
import Toast from "react-native-toast-message";

export default function HomeScreen() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errosFields, setErrosFields] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				router.push("/(tabs)");
			} else {
				setLoading(false)
			}
		});

		return unsubscribe;
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setErrosFields({
			email: "",
			password: "",
		});
	}, [email, password]);

	const verifyFields = () => {
		if (email === "" || password === "") {
			Toast.show({
				type: "error",
				text1: "Erro no login",
				text2: "Preencha todos os campos",
			});
			if (email === "") {
				setErrosFields((prev) => ({
					...prev,
					email: "Email é obrigatório",
				}));
			}
			if (password === "") {
				setErrosFields((prev) => ({
					...prev,
					password: "Senha é obrigatória",
				}));
			}
			return false;
		}
		handleLogin();
	};

	const handleLogin = async () => {
		try {
			await signInWithEmailAndPassword(auth, email, password);
			router.push("/(tabs)");
		} catch (error: any) {
			let errorMsg = "Erro ao realizar login";

			if (error?.code === "auth/user-not-found") {
				errorMsg = "Este usuário não existe";
			} else if (error?.code === "auth/wrong-password") {
				errorMsg = "Senha incorreta";
			} else if (error?.code === "auth/invalid-credential") {
				errorMsg = "Credenciais inválidas";
			}

			Toast.show({
				type: "error",
				text1: "Erro de autenticação",
				text2: errorMsg,
			});
		}
	};


	if(loading){
		return(
			<ActivityIndicator size="large" color="#00ff00" />		
		)
	}


	return (
		<View style={styles.container}>
			<Text style={styles.title}>Home</Text>
			<View style={styles.inputContainer}>
				<Text
					style={errosFields.email !== "" ? styles.labelError : styles.label}
				>
					Email
				</Text>
				<TextInput
					keyboardType="email-address"
					onChangeText={setEmail}
					style={errosFields.email !== "" ? styles.inputError : styles.input}
				/>
				{errosFields.email !== "" && (
					<Text style={styles.errorText}>{errosFields.email}</Text>
				)}
			</View>
			<View style={styles.inputContainer}>
				<Text
					style={errosFields.password !== "" ? styles.labelError : styles.label}
				>
					Senha
				</Text>
				<TextInput
					secureTextEntry
					onChangeText={setPassword}
					style={errosFields.password !== "" ? styles.inputError : styles.input}
				/>
				{errosFields.password !== "" && (
					<Text style={styles.errorText}>{errosFields.password}</Text>
				)}
			</View>
			<TouchableHighlight
				style={styles.ghostButton}
				onPress={() => router.push("/forgot")}
			>
				<Text style={styles.ghostButtonText}>Esqueci minha senha</Text>
			</TouchableHighlight>
			<Pressable style={styles.loginButton} onPress={verifyFields}>
				<Text style={styles.buttonText}>Acessar</Text>
			</Pressable>
			<Pressable
				style={styles.signupButton}
				onPress={() => {
					router.push("/signup");
				}}
			>
				<Text style={styles.buttonText}>Quero me cadastrar</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 40,
	},
	title: {
		fontSize: 30,
		color: "#84cc16",
	},
	inputContainer: {
		width: "100%",
		marginTop: 16,
	},
	label: {
		fontSize: 14,
		color: "white",
		paddingBottom: 8,
	},
	labelError: {
		fontSize: 14,
		color: "#ef4444",
		paddingBottom: 8,
	},
	input: {
		backgroundColor: "#27272a",
		width: "100%",
		borderRadius: 8,
		color: "white",
		paddingHorizontal: 16,
	},
	inputError: {
		backgroundColor: "#450a0a",
		width: "100%",
		borderRadius: 8,
		color: "white",
		paddingHorizontal: 16,
	},
	loginButton: {
		marginTop: 24,
		width: "100%",
		backgroundColor: "#eab308",
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 6,
		justifyContent: "center",
		alignItems: "center",
		height: 40,
	},
	ghostButton: {
		marginTop: 24,
		width: "100%",
		paddingVertical: 8,
		borderRadius: 6,
	},
	signupButton: {
		marginTop: 24,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 6,
	},
	buttonText: {
		fontSize: 20,
		color: "white",
	},
	errorText: {
		fontSize: 12,
		color: "#ef4444",
	},
	ghostButtonText: {
		fontSize: 14,
		color: "white",
		textAlign: "right",
	},
});
