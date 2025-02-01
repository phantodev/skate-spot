import {
	Pressable,
	StyleSheet,
	Text,
	View,
	Modal,
	ScrollView,
	TextInput,
	ActivityIndicator,
	SafeAreaView,
} from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HomeScreen() {
	const router = useRouter();
	const [modalVisible, setModalVisible] = useState(false);
	const [spotName, setSpotName] = useState("");
	const [description, setDescription] = useState("");
	const [address, setAddress] = useState("");
	const [neighborhood, setNeighborhood] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [zipCode, setZipCode] = useState("");
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");

	async function handleLogout() {
		router.replace("/");
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Seja bem-vindo(a)!</Text>
			<Text style={styles.text}>
				Você ainda não possui spots cadastrados. Aperte no botão abaixo para
				cadastrar.
			</Text>
			<LottieView
				style={{ width: 300, height: 300 }}
				source={require("../../assets/skate.json")}
				autoPlay
				loop
			/>
			<Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
				<Text>Cadastrar spot</Text>
			</Pressable>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Cadastrar Spot</Text>
							<Pressable onPress={() => setModalVisible(!modalVisible)}>
								<Text>
									<FontAwesome name="close" size={24} color="white" />
								</Text>
							</Pressable>
						</View>
						<ScrollView style={styles.formContainer}>
							<View style={styles.inputContainer}>
								<Text style={styles.label}>Nome do Spot</Text>
								<TextInput
									style={styles.input}
									value={spotName}
									onChangeText={setSpotName}
									placeholder="Ex: Pista Municipal"
									placeholderTextColor="#666"
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Descrição</Text>
								<TextInput
									style={[styles.input, styles.textArea]}
									value={description}
									onChangeText={setDescription}
									placeholder="Descreva o spot..."
									placeholderTextColor="#666"
									multiline
									numberOfLines={4}
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>CEP</Text>
								<TextInput
									style={styles.input}
									value={zipCode}
									onChangeText={setZipCode}
									placeholder="CEP"
									placeholderTextColor="#666"
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Endereço</Text>
								<TextInput
									style={styles.input}
									value={address}
									onChangeText={setAddress}
									placeholder="Rua, número"
									placeholderTextColor="#666"
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Bairro</Text>
								<TextInput
									style={styles.input}
									value={neighborhood}
									onChangeText={setNeighborhood}
									placeholder="Bairro"
									placeholderTextColor="#666"
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Cidade</Text>
								<TextInput
									style={styles.input}
									value={city}
									onChangeText={setCity}
									placeholder="Cidade"
									placeholderTextColor="#666"
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Estado</Text>
								<TextInput
									style={styles.input}
									value={state}
									onChangeText={setState}
									placeholder="Estado"
									placeholderTextColor="#666"
								/>
							</View>

							<Pressable
								style={[styles.addButton, styles.submitButton]}
								onPress={() => {}}
								disabled={status === "loading"}
							>
								{status === "loading" ? (
									<ActivityIndicator color="#000" />
								) : (
									<Text style={styles.buttonText}>Cadastrar Spot</Text>
								)}
							</Pressable>
						</ScrollView>
					</View>
				</View>
			</Modal>
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
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
		marginBottom: 24,
	},
	text: {
		fontSize: 14,
		color: "white",
		marginBottom: 24,
		textAlign: "center",
		paddingHorizontal: 20,
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: "absolute",
	},
	addButton: {
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
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
	},
	modalView: {
		width: "100%",
		backgroundColor: "#18181b",
		padding: 0,
		flex: 1,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#27272a",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "white",
	},
	formContainer: {
		padding: 16,
	},
	inputContainer: {
		marginBottom: 16,
	},
	label: {
		color: "white",
		marginBottom: 8,
		fontSize: 14,
	},
	input: {
		backgroundColor: "#27272a",
		borderRadius: 6,
		padding: 12,
		color: "white",
		fontSize: 14,
	},
	textArea: {
		height: 100,
		textAlignVertical: "top",
	},
	submitButton: {
		marginTop: 8,
		marginBottom: 16,
	},
	buttonText: {
		color: "#000",
		fontSize: 16,
		fontWeight: "500",
	},
});
