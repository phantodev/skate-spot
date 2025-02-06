import {
	Button,
	Modal,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	Alert,
	ActivityIndicator,
	ScrollView,
} from "react-native";
import * as S from "../../assets/styles/global";
import Feather from "@expo/vector-icons/Feather";
import { useState, useRef, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { CameraView, type CameraType, useCameraPermissions } from "expo-camera";
import { supabase } from "../../supabaseConfig";
import { useLocalSearchParams } from "expo-router";

export default function AddSpotPhotoScreen() {
	const { id } = useLocalSearchParams();
	const spotId = Array.isArray(id) ? id[0] : id;
	const [modalVisible, setModalVisible] = useState(false);
	const [facing, setFacing] = useState<CameraType>("back");
	const [permission, requestPermission] = useCameraPermissions();
	const refCamera = useRef<CameraView>(null);
	const [uri, setUri] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const [listPhotos, setListPhotos] = useState<string[]>([]);

	useEffect(() => {
		loadPhotosFromSupabaseStorage();
	}, []);

	// useEffect(() => {
	// 	Alert.alert("listPhotos", JSON.stringify(listPhotos));
	// }, [listPhotos]);

	if (!permission) {
		return <View />;
	}

	if (!permission.granted) {
		return (
			<S.Container>
				<S.Text>Nós precisamos da permissão de camera</S.Text>
				<Button onPress={requestPermission} title="Liberar acesso a camera" />
			</S.Container>
		);
	}

	async function takePicture() {
		try {
			if (!refCamera.current) {
				console.error("Camera reference is null");
				return;
			}
			const photo = await refCamera.current.takePictureAsync();
			if (!photo) {
				console.error("Failed to take photo");
				return;
			}
			setUri(photo.uri);
			// setModalVisible(false);
		} catch (error) {
			console.error("Error taking picture:", error);
		}
	}

	async function loadPhotosFromSupabaseStorage() {
		try {
			// Lista todos os arquivos na pasta do spot específico
			const { data, error } = await supabase.storage
				.from("spots")
				.list(spotId, {
					limit: 100,
					offset: 0,
					sortBy: { column: 'name', order: 'asc' }
				});

			if (error) {
				Alert.alert("Erro Supabase", JSON.stringify(error));
				throw error;
			}

			// Se houver arquivos, obter as URLs públicas
			if (data && data.length > 0) {
				const publicUrls = await Promise.all(
					data
						.filter(file => file.name.startsWith('spot-'))
						.map(async (file) => {
							const { data: { publicUrl } } = supabase.storage
								.from("spots")
								.getPublicUrl(`${spotId}/${file.name}`);
							return publicUrl;
						})
				);
				
				setListPhotos(publicUrls);
			}
		} catch (error) {
			console.error("Erro ao carregar fotos:", error);
			Alert.alert("Erro", "Não foi possível carregar as fotos do spot.");
		}
	}

	function toggleCameraFacing() {
		setFacing((current) => (current === "back" ? "front" : "back"));
	}

	async function uploadPictureToSupabaseStorage() {
		if (uri !== null) {
			try {
				setUploading(true);

				// Criar um objeto FormData com a imagem
				const formData = new FormData();
				formData.append("file", {
					uri: uri,
					type: "image/jpeg",
					name: "spot.jpg",
				} as any);

				// Fazer upload para o Supabase Storage
				const { data, error } = await supabase.storage
					.from("spots")
					.upload(`${spotId}/spot-${Date.now()}.jpg`, formData);

				if (error) {
					throw error;
				}

				// Obter a URL pública da imagem
				const {
					data: { publicUrl },
				} = supabase.storage.from("spots").getPublicUrl(data.path);

				setModalVisible(false);
				setUri(null);
				setUploading(false);
				setListPhotos((prev) => [...prev, publicUrl]);
			} catch (error) {
				console.error("Erro ao fazer upload da imagem:", error);
				Alert.alert("Erro", "Não foi possível fazer o upload da imagem.");
				setUploading(false);
			}
		}
	}

	function updateSpotWithPicture() {}

	return (
		<S.Container>
			<S.Content>
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollViewContent}
				>
					{listPhotos.length === 0 && (
						<>
							<Feather name="camera-off" size={180} color="#eab308" />
							<S.Text>
								Você não possui fotos cadastradas para este spot. Tire uma foto
								maneira e adicione ao spot!
							</S.Text>
						</>
					)}
					<View style={styles.containerPhoto}>
						{listPhotos.length > 0 &&
							listPhotos.map((photo, index) => (
								<Image
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={index}
									resizeMode="cover"
									source={{ uri: photo }}
									style={{
										width: listPhotos.length === 1 ? "100%" : "48%",
										height: listPhotos.length === 1 ? 300 : 150,
										borderRadius: 20,
										marginBottom: 20,
									}}
								/>
							))}
					</View>
					<S.AddPhotoButton onPress={() => setModalVisible(true)}>
						<S.AddPhotoButtonText>Adicionar foto</S.AddPhotoButtonText>
					</S.AddPhotoButton>
				</ScrollView>
			</S.Content>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<S.CentredView>
					{uri === null ? (
						<CameraView ref={refCamera} style={styles.camera} facing={facing}>
							<View style={styles.buttonContainer}>
								<TouchableOpacity
									style={styles.button}
									onPress={toggleCameraFacing}
								>
									<Text style={styles.text}>Flip</Text>
								</TouchableOpacity>
								<TouchableOpacity style={styles.button} onPress={takePicture}>
									<Text style={styles.text}>Take</Text>
								</TouchableOpacity>
							</View>
						</CameraView>
					) : (
						<>
							<S.SavePhotoButton onPress={uploadPictureToSupabaseStorage}>
								{uploading ? (
									<ActivityIndicator color="#fff" />
								) : (
									<S.AddPhotoButtonText>Salvar Foto</S.AddPhotoButtonText>
								)}
							</S.SavePhotoButton>
							<S.RemovePhotoButton onPress={() => setUri(null)}>
								<S.RemovePhotoButtonText>
									Tirar outra Foto
								</S.RemovePhotoButtonText>
							</S.RemovePhotoButton>
							<Image source={{ uri }} style={styles.camera} />
						</>
					)}
				</S.CentredView>
			</Modal>
		</S.Container>
	);
}

const styles = StyleSheet.create({
	containerPhoto: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		gap: 4,
	},
	scrollView: {
		width: "100%",
		flex: 1,
	},
	scrollViewContent: {
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
	container: {
		flex: 1,
		justifyContent: "center",
	},
	message: {
		textAlign: "center",
		paddingBottom: 10,
	},
	camera: {
		flex: 1,
		width: "100%",
	},
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "transparent",
		margin: 64,
	},
	button: {
		flex: 1,
		alignSelf: "flex-end",
		alignItems: "center",
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
});
