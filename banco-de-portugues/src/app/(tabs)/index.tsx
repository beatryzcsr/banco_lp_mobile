import { Link } from 'expo-router';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from '@/components/top-bar';
import { AppColors, readingBackground } from '@/constants/app-theme';

export default function HomeScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ImageBackground
          resizeMode="cover"
          source={readingBackground}
          style={styles.hero}
          imageStyle={styles.heroImage}>
          <View style={styles.heroShade}>
            <Text style={styles.eyebrow}>HUB DO CONHECIMENTO</Text>
            <Text style={styles.heroTitle}>Banco de Questões</Text>
            <Text style={styles.heroDescription}>Pratique Língua Portuguesa no seu ritmo.</Text>
          </View>
        </ImageBackground>

        <Text style={styles.sectionTitle}>Escolha por onde começar</Text>
        <View style={styles.studyCards}>
          <Link href="/(tabs)/gramatica" asChild>
            <Pressable style={styles.studyCard}>
              <Text style={styles.cardKicker}>ESTUDE</Text>
              <Text style={styles.cardTitle}>Gramática</Text>
              <Text style={styles.cardDescription}>
                Questões de análise sintática e variação linguística.
              </Text>
              <Text style={styles.cardAction}>Explorar questões  →</Text>
            </Pressable>
          </Link>
          <Link href="/(tabs)/literatura" asChild>
            <Pressable style={[styles.studyCard, styles.literatureCard]}>
              <Text style={styles.cardKicker}>LEIA E PRATIQUE</Text>
              <Text style={styles.cardTitle}>Literatura</Text>
              <Text style={styles.cardDescription}>
                Revise Romantismo, Modernismo e outros temas.
              </Text>
              <Text style={styles.cardAction}>Explorar questões  →</Text>
            </Pressable>
          </Link>
        </View>

        <Text style={styles.sectionTitle}>Sobre o projeto</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>SOBRE NÓS</Text>
          <Text style={styles.infoText}>
            Somos o Megamind, uma equipe de cinco estudantes da rede SESI–SENAI de Vinhedo,
            dedicada ao desenvolvimento de sistemas.
          </Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>NOSSO OBJETIVO</Text>
          <Text style={styles.infoText}>
            Promover o acesso a questões de Língua Portuguesa, com foco em Gramática e Literatura,
            para quem está se preparando para vestibulares.
          </Text>
        </View>
        <Text style={styles.footer}>Megamind @ SESI-SENAI</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: AppColors.cream,
    flex: 1,
  },
  content: {
    paddingBottom: 28,
  },
  hero: {
    height: 340,
    justifyContent: 'flex-end',
    margin: 16,
    overflow: 'hidden',
    borderRadius: 26,
    backgroundColor: AppColors.wine,
  },
  heroImage: {
    opacity: 0.9,
  },
  heroShade: {
    backgroundColor: 'rgba(35, 10, 13, 0.42)',
    minHeight: 190,
    justifyContent: 'flex-end',
    padding: 22,
  },
  eyebrow: {
    color: AppColors.cream,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginBottom: 8,
  },
  heroTitle: {
    color: AppColors.white,
    fontSize: 38,
    fontWeight: '900',
    lineHeight: 44,
  },
  heroDescription: {
    color: AppColors.cream,
    fontSize: 16,
    marginTop: 8,
  },
  sectionTitle: {
    color: AppColors.wine,
    fontSize: 22,
    fontWeight: '800',
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 12,
  },
  studyCards: {
    gap: 12,
    marginHorizontal: 16,
  },
  studyCard: {
    backgroundColor: AppColors.wine,
    borderRadius: 20,
    padding: 20,
  },
  literatureCard: {
    backgroundColor: AppColors.rose,
  },
  cardKicker: {
    color: AppColors.cream,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  cardTitle: {
    color: AppColors.white,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 8,
  },
  cardDescription: {
    color: AppColors.white,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  cardAction: {
    color: AppColors.cream,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 16,
  },
  infoCard: {
    backgroundColor: AppColors.white,
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 18,
  },
  infoTitle: {
    color: AppColors.wine,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  infoText: {
    color: AppColors.ink,
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    color: AppColors.wine,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 14,
    textAlign: 'center',
  },
});
