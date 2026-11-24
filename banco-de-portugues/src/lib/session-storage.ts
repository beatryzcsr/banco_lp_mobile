import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const SESSION_KEY = 'jwtToken';

export function getSession() {
  return Platform.OS === 'web'
    ? AsyncStorage.getItem(SESSION_KEY)
    : SecureStore.getItemAsync(SESSION_KEY);
}

export function saveSession(token: string) {
  return Platform.OS === 'web'
    ? AsyncStorage.setItem(SESSION_KEY, token)
    : SecureStore.setItemAsync(SESSION_KEY, token);
}

export function clearSession() {
  return Platform.OS === 'web'
    ? AsyncStorage.removeItem(SESSION_KEY)
    : SecureStore.deleteItemAsync(SESSION_KEY);
}
