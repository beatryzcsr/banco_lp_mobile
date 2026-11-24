import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/app-theme';
import { useAuth } from '@/context/auth-context';

export function TopBar() {
  const { signOut } = useAuth();
  const [error, setError] = useState('');

  async function handleSignOut() {
    setError('');

    try {
      await signOut();
      router.replace('/login');
    } catch (signOutError) {
      setError(
        signOutError instanceof Error
          ? signOutError.message
          : 'Não foi possível encerrar sua sessão.',
      );
    }
  }

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>LP</Text>
        </View>
        <Text style={styles.brandName}>Banco de Português</Text>
        <Pressable
          accessibilityRole="button"
          onPress={handleSignOut}
          style={({ pressed }) => [styles.signOutButton, pressed && styles.pressed]}>
          <Text style={styles.signOutLabel}>Sair</Text>
        </Pressable>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: AppColors.wine,
    borderRadius: 13,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  brandMarkText: {
    color: AppColors.cream,
    fontSize: 13,
    fontWeight: '900',
  },
  brandName: {
    color: AppColors.wine,
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 10,
  },
  signOutButton: {
    backgroundColor: AppColors.orange,
    borderColor: AppColors.white,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 9,
  },
  signOutLabel: {
    color: AppColors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.75,
  },
  error: {
    color: AppColors.danger,
    fontSize: 13,
    marginHorizontal: 18,
    marginBottom: 8,
  },
});
