import { auth } from '@/firebaseConfig';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { View, Text, Pressable } from 'react-native';

export default function MyProfileScreen() {
  async function handleLogout() {
    try {
      await signOut(auth);
      router.replace("/(auth)");
    } catch (error) {
      console.error(error);
    } 
  }

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: "#27272a",
    }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ffffff' }}>My Profile</Text>
      <Pressable onPress={handleLogout} style={{ marginTop: 20, backgroundColor: '#eab308', padding: 10, borderRadius: 8 }}>
           <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ffffff' }}>Logout</Text>
      </Pressable>
    </View>
  );
}
