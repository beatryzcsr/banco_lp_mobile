import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppColors } from '@/constants/app-theme';
import { AuthProvider, useAuth } from '@/context/auth-context';

function RootNavigator() {
  const { isLoading, storageError, retryLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={AppColors.wine} size="large" />
        <Text style={styles.loadingText}>Preparando sua biblioteca...</Text>
      </View>
    );
  }

  if (storageError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Não foi possível abrir sua sessão</Text>
        <Text style={styles.errorText}>{storageError}</Text>
        <Pressable onPress={retryLoading} style={styles.retryButton}>
          <Text style={styles.retryLabel}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    backgroundColor: AppColors.cream,
  },
  loadingText: {
    color: AppColors.wine,
    fontSize: 16,
    marginTop: 16,
  },
  errorTitle: {
    color: AppColors.wine,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorText: {
    color: AppColors.ink,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: AppColors.wine,
    borderRadius: 12,
    marginTop: 22,
    paddingHorizontal: 22,
    paddingVertical: 13,
  },
  retryLabel: {
    color: AppColors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
