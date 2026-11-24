import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppColors, readingBackground } from '@/constants/app-theme';
import { useAuth } from '@/context/auth-context';
import { login } from '@/lib/api';

export default function LoginScreen() {
  const { session, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  async function handleLogin() {
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setMessage('Preencha seu e-mail e sua senha.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const token = await login(normalizedEmail, password);
      await signIn(token);
      router.replace('/(tabs)');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível entrar.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ImageBackground
      source={readingBackground}
      resizeMode="cover"
      style={styles.background}
      imageStyle={styles.backgroundImage}>
      <View style={styles.scrim} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardArea}>
          <View style={styles.content}>
            <Text style={styles.title}>Login</Text>
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Insira seu e-mail e senha</Text>

              {message ? (
                <Text accessibilityRole="alert" style={styles.message}>
                  {message}
                </Text>
              ) : null}

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                  accessibilityLabel="E-mail"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  editable={!isSubmitting}
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  onSubmitEditing={handleLogin}
                  placeholder="seu.email@exemplo.com"
                  placeholderTextColor={AppColors.muted}
                  returnKeyType="next"
                  style={styles.input}
                  textContentType="emailAddress"
                  value={email}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Senha</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    accessibilityLabel="Senha"
                    autoCapitalize="none"
                    autoComplete="current-password"
                    editable={!isSubmitting}
                    onChangeText={setPassword}
                    onSubmitEditing={handleLogin}
                    placeholder="Sua senha"
                    placeholderTextColor={AppColors.muted}
                    returnKeyType="done"
                    secureTextEntry={!showPassword}
                    style={[styles.input, styles.passwordInput]}
                    textContentType="password"
                    value={password}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    disabled={isSubmitting}
                    onPress={() => setShowPassword((visible) => !visible)}
                    style={styles.showPasswordButton}>
                    <Text style={styles.showPasswordText}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
                  </Pressable>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                disabled={isSubmitting}
                onPress={handleLogin}
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed && !isSubmitting && styles.pressed,
                  isSubmitting && styles.disabledButton,
                ]}>
                {isSubmitting ? (
                  <ActivityIndicator color={AppColors.white} />
                ) : (
                  <Text style={styles.submitLabel}>Entrar</Text>
                )}
              </Pressable>
            </View>
            <Text style={styles.caption}>Seu espaço de estudo em Língua Portuguesa</Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: AppColors.wine,
  },
  backgroundImage: {
    opacity: 0.9,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35, 10, 13, 0.34)',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  keyboardArea: {
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: AppColors.cream,
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: -2,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.28)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  panel: {
    backgroundColor: AppColors.cream,
    borderRadius: 28,
    maxWidth: 460,
    paddingHorizontal: 22,
    paddingVertical: 26,
    width: '100%',
  },
  panelTitle: {
    color: AppColors.ink,
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 22,
    textAlign: 'center',
  },
  message: {
    backgroundColor: '#F8E3DD',
    borderRadius: 10,
    color: AppColors.wine,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    padding: 12,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    color: AppColors.wine,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 7,
  },
  input: {
    borderColor: AppColors.wine,
    borderRadius: 11,
    borderWidth: 1.5,
    color: AppColors.ink,
    fontSize: 16,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  passwordRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  passwordInput: {
    flex: 1,
  },
  showPasswordButton: {
    marginLeft: 10,
    padding: 8,
  },
  showPasswordText: {
    color: AppColors.wine,
    fontSize: 13,
    fontWeight: '700',
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: AppColors.wine,
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 50,
  },
  submitLabel: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.7,
  },
  pressed: {
    opacity: 0.84,
  },
  caption: {
    color: AppColors.cream,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 18,
    textAlign: 'center',
  },
});
