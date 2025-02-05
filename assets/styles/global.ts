import styled from "styled-components/native";

export const Container = styled.View`
    padding-top: 40px;
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

export const AddPhotoButtonText = styled.Text`
    font-weight: bold;
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
