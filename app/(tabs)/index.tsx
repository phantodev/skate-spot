import Feather from "@expo/vector-icons/Feather";
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
	Alert,
} from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useContext, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import {
	collection,
	addDoc,
	doc,
	getDocs,
	query,
	updateDoc,
	deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { MainContext } from "../_layout";
import React from "react";
import { useActionSheet } from "@expo/react-native-action-sheet";

export interface Spot {
	id: string;
	spotName: string;
	description: string;
	address: string;
	neighborhood: string;
	city: string;
	state: string;
	zipCode: string;
	createdAt: string;
	photo?: string[];
}

export default function HomeScreen() {
	const { showActionSheetWithOptions } = useActionSheet();
	const { isFetchingSpots, setFetchingSpots, tempSpots, setTempSpots } =
		useContext(MainContext);
	const [spots, setSpots] = useState<Spot[]>([]);
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

	const clearState = () => {
		setSpotName("");
		setDescription("");
		setAddress("");
		setNeighborhood("");
		setCity("");
		setState("");
		setZipCode("");
	};

	const formatCEPWithDash = (cep: string) => {
		return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
	};

	const removeDash = (cep: string) => {
		return cep.replace(/(\d{5})(\d{3})/, "$1$2");
	};

	const openActionSheet = (id: string) => {
		const options = ["Delete", "Cancel"];
		const destructiveButtonIndex = 0;
		const cancelButtonIndex = 2;
		const title = "Are you sure you want to delete this spot?";
		const message = "This action cannot be undone";

		showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex,
				destructiveButtonIndex,
				title,
				message,
			},
			(selectedIndex: number) => {
				switch (selectedIndex) {
					case 1:
						// Save
						break;

					case destructiveButtonIndex:
						deleteSpot(id);
						break;

					case cancelButtonIndex:
					// Canceled
				}
			},
		);
	};

	const fetchCEP = async () => {
		fetch(`https://viacep.com.br/ws/${removeDash(zipCode)}/json/`)
			.then((response) => response.json())
			.then((data) => {
				setAddress(data.logradouro);
				setNeighborhood(data.bairro);
				setCity(data.localidade);
				setState(data.uf);
			})
			.catch((error) => console.log(error));
	};

	const fetchSpots = async () => {
		try {
			setFetchingSpots(true);
			const q = query(collection(db, "spots"));
			const querySnapshot = await getDocs(q);
			const newSpots: Spot[] = [];
			for (const doc of querySnapshot.docs) {
				newSpots.push({
					id: doc.id,
					spotName: doc.data().spotName,
					description: doc.data().description,
					address: doc.data().address,
					neighborhood: doc.data().neighborhood,
					city: doc.data().city,
					state: doc.data().state,
					zipCode: doc.data().zipCode,
					createdAt: doc.data().createdAt,
					photo: doc.data().photo,
				});
			}
			setSpots(newSpots);
		} catch (error) {
			console.error("Error fetching spots:", error);
			Toast.show({
				type: "error",
				text1: "Erro ao carregar spots",
				text2: "Tente novamente!",
			});
		} finally {
			setFetchingSpots(false);
		}
	};

	useFocusEffect(
		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		React.useCallback(() => {
			fetchSpots();
		}, []),
	);

	const updateSpot = async () => {
		if (spotName === "" || description === "" || address === "") {
			Toast.show({
				type: "error",
				text1: "Erro no cadastro",
				text2: "Preencha todos os campos",
			});
			return;
		}
		try {
			setStatus("loading");
			const spotRef = doc(db, "spots", tempSpots.id);
			await updateDoc(spotRef, {
				spotName,
				description,
				address,
				neighborhood,
				city,
				state,
				zipCode,
			});
			setStatus("idle");
			Toast.show({
				type: "success",
				text1: "Sucesso",
				text2: "Atualizado spot!",
			});
			setModalVisible(false);
			clearState();
			fetchSpots();
			setTempSpots({} as Spot);
		} catch (error) {}
	};

	const deleteSpot = async (id: string) => {
		try {
			setStatus("loading");
			const spotRef = doc(db, "spots", id);
			await deleteDoc(spotRef);
			setStatus("idle");
			Toast.show({
				type: "success",
				text1: "Sucesso",
				text2: "Spot removido!",
			});
			fetchSpots();
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Erro ao deletar spot",
				text2: "Tente novamente!",
			});
		}
	};

	const saveSpot = async () => {
		if (spotName === "" || description === "" || address === "") {
			Toast.show({
				type: "error",
				text1: "Erro no cadastro",
				text2: "Preencha todos os campos",
			});
			return;
		}
		try {
			setStatus("loading");
			await addDoc(collection(db, "spots"), {
				spotName,
				description,
				address,
				neighborhood,
				city,
				state,
				zipCode,
				createdAt: new Date().toISOString(),
			});
			setStatus("idle");
			Toast.show({
				type: "success",
				text1: "Sucesso",
				text2: "Spot cadastrado com sucesso!",
			});
			setModalVisible(false);
			clearState();
			await fetchSpots(); // Aguarda o fetchSpots completar
		} catch (error) {
			setStatus("error");
			console.error("Error saving spot:", error);
			Toast.show({
				type: "error",
				text1: "Erro no cadastro",
				text2: "Erro ao cadastrar spot",
			});
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (zipCode.length === 8) {
			setZipCode(formatCEPWithDash(zipCode));
			fetchCEP();
		}
	}, [zipCode]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!modalVisible) {
			clearState();
		}
	}, [modalVisible]);

	useEffect(() => {
		if (tempSpots?.spotName) {
			setSpotName(tempSpots.spotName);
			setDescription(tempSpots.description);
			setAddress(tempSpots.address);
			setNeighborhood(tempSpots.neighborhood);
			setCity(tempSpots.city);
			setState(tempSpots.state);
			setZipCode(tempSpots.zipCode);
			setModalVisible(true);
		}
	}, [tempSpots]);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Seja bem-vindo(a)!</Text>
			{spots && spots.length > 0
				? spots.map((spot) => (
						<View style={styles.spotsContainer} key={spot.id}>
							<View style={styles.spotHeader}>
								<Text style={styles.titleSpot}>
									{spot.spotName ? spot.spotName.toUpperCase() : ""}
								</Text>
								<Pressable
									style={styles.cameraContainer}
									onPress={() =>
										router.push({
											pathname: "/addSpotPhoto/[id]",
											params: { id: spot.id },
										})
									}
								>
									<Feather name="camera" size={24} color="white" />
									<Text style={styles.textSpot}>{spot.photo?.length || 0}</Text>
								</Pressable>
							</View>
							<Text style={styles.textSpot}>{spot.description || ""}</Text>
							<View>
								<Text style={styles.textSpot}>{spot.address || ""}</Text>
								<Text style={styles.textSpot}>{spot.neighborhood || ""}</Text>
								<Text style={styles.textSpot}>
									{spot.city || ""} - {spot.state || ""}
								</Text>
							</View>
							<View style={styles.buttonsContainer}>
								<Pressable onPress={() => openActionSheet(spot.id)}>
									<Text style={styles.textRemove}>Remover</Text>
								</Pressable>
								<Pressable onPress={() => setTempSpots(spot)}>
									<Text style={styles.textEdit}>Editar</Text>
								</Pressable>
							</View>
						</View>
					))
				: !isFetchingSpots &&
					spots.length === 0 && (
						<View>
							<Text style={styles.text}>
								Você ainda não possui spots cadastrados. Aperte no botão abaixo
								para cadastrar.
							</Text>
							<LottieView
								style={{ width: 300, height: 300 }}
								source={require("../../assets/skate.json")}
								autoPlay
								loop
							/>
						</View>
					)}
			{isFetchingSpots && spots.length === 0 && (
				<View>
					<ActivityIndicator />
					<Text style={styles.text}>Carregando...</Text>
				</View>
			)}
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
									editable={false}
									cursorColor="#fff"
									style={styles.input}
									value={address}
									placeholder="Rua, número"
									placeholderTextColor="#666"
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Bairro</Text>
								<TextInput
									editable={false}
									style={styles.input}
									value={neighborhood}
									placeholder="Bairro"
									placeholderTextColor="#666"
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Cidade</Text>
								<TextInput
									editable={false}
									style={styles.input}
									value={city}
									placeholder="Cidade"
									placeholderTextColor="#666"
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Estado</Text>
								<TextInput
									editable={false}
									style={styles.input}
									value={state}
									placeholder="Estado"
									placeholderTextColor="#666"
								/>
							</View>

							<Pressable
								style={
									status !== "success"
										? styles.addButton
										: styles.addButtonSuccess
								}
								onPress={tempSpots?.id ? updateSpot : saveSpot}
								disabled={status === "loading"}
							>
								{status === "loading" ? (
									<ActivityIndicator color="#000" />
								) : status === "success" ? (
									<Text style={styles.buttonText}>
										Spot cadastrado com sucesso!
									</Text>
								) : (
									<Text style={styles.buttonText}>
										{tempSpots?.id ? "Atualizar Spot" : "Cadastrar Spot"}{" "}
									</Text>
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
	cameraContainer: {
		display: "flex",
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
	},
	spotHeader: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	buttonsContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		padding: 10,
	},
	textRemove: {
		fontSize: 14,
		color: "#dc2626",
		textAlign: "center",
		paddingHorizontal: 20,
	},
	textEdit: {
		fontSize: 14,
		color: "#65a30d",
		textAlign: "center",
		paddingHorizontal: 20,
	},
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
	textSpot: {
		fontSize: 14,
		color: "white",
		textAlign: "left",
	},
	titleSpot: {
		fontSize: 20,
		fontWeight: "bold",
		color: "white",
		textAlign: "left",
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
	addButtonSuccess: {
		marginTop: 24,
		width: "100%",
		backgroundColor: "#65a30d",
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
	buttonText: {
		color: "#000",
		fontSize: 16,
		fontWeight: "500",
	},
	spotsContainer: {
		width: "100%",
		marginBottom: 16,
		backgroundColor: "#27272a",
		padding: 16,
		borderRadius: 8,
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		gap: 10,
	},
});
