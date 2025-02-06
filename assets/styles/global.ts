import styled from "styled-components/native";

export const Container = styled.View`
    flex: 1;
`;

export const Header = styled.View`
    background-color: #18181b;
    height: 60px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-left: 20px;
`;

export const Title = styled.Text`
	font-size: 20px;
	font-weight: bold;
    color: #ffffff;
`;

export const Text = styled.Text`
    color: #ffffff;
    font-size: 14px;
    text-align: center;
    margin-top: 40px;
`;

export const Content = styled.View`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
`;

export const AddPhotoButton = styled.TouchableOpacity`
    background-color: #eab308;
    width: 180px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
`;

export const SavePhotoButton = styled.TouchableOpacity`
    background-color: #eab308;
    width: 180px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
    position: absolute;
    bottom: 80px;
    z-index: 100;
`;

export const RemovePhotoButton = styled.TouchableOpacity`
    width: 180px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 20px;
    z-index: 99;
`;

export const AddPhotoButtonText = styled.Text`
    font-weight: bold;
`;

export const RemovePhotoButtonText = styled.Text`
    font-weight: bold;
    color: #ffffff;
`;

export const CentredView = styled.View`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #18181b;
    width: 100%;
    height: 100%;    
`;

export const ContainerImage = styled.Image`
    width: 180px;
    height: 180px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
`;
