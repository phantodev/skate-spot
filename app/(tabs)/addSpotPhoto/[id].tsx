import {
	Button,
	Modal,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import * as S from "../../../assets/styles/global";
import Feather from "@expo/vector-icons/Feather";
import { useState, useRef } from "react";
import { CameraView, type CameraType, useCameraPermissions } from "expo-camera";

export default function AddSpotPhotoScreen() {
	const [modalVisible, setModalVisible] = useState(false);
	const [facing, setFacing] = useState<CameraType>("back");
	const [permission, requestPermission] = useCameraPermissions();
	const ref = useRef<CameraView>(null);
	const [uri, setUri] = useState<string | null>(null);

	if (!permission) {
		// Camera permissions are still loading.
		return <View />;
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet.
		return (
			<S.Container>
				<S.Text>Nós precisamos da permissão de camera</S.Text>
				<Button onPress={requestPermission} title="Liberar acesso a camera" />
			</S.Container>
		);
	}

	async function takePicture() {
		const photo = await ref.current?.takePictureAsync();
		if (!photo) return;
		setUri(photo?.uri);
		setModalVisible(false);
	}

	function toggleCameraFacing() {
		setFacing((current) => (current === "back" ? "front" : "back"));
	}

	return (
		<S.Container>
			<S.Header>
				<S.Title>Lista de fotos do spot</S.Title>
			</S.Header>
			<S.Content>
				<Feather name="camera-off" size={180} color="#eab308" />
				<S.Text>
					Você não possui fotos cadastradas para este spot. Tire uma foto
					maneira e adicione ao spot!
				</S.Text>
				<S.AddPhotoButton onPress={() => setModalVisible(true)}>
					<S.AddPhotoButtonText>Adicionar foto</S.AddPhotoButtonText>
				</S.AddPhotoButton>
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
					<CameraView ref={ref} style={styles.camera} facing={facing}>
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
				</S.CentredView>
			</Modal>
		</S.Container>
	);
}

const styles = StyleSheet.create({
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
