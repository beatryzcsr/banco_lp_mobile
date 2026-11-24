import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from '@/components/top-bar';
import { AppColors } from '@/constants/app-theme';
import { fetchQuestions, type Question } from '@/lib/api';

type Subject = 'grammar' | 'literature';
type FilterChoice = { label: string; value: string };

const institutions: FilterChoice[] = [
  { label: 'Todas', value: '' },
  { label: 'ENEM', value: 'ENEM' },
  { label: 'ENEM PPL', value: 'ENEM PPL' },
  { label: 'FUVEST', value: 'Fuvest' },
  { label: 'UNIFESP', value: 'Unifesp' },
  { label: 'MACKENZIE', value: 'Mackenzie' },
  { label: 'UEL', value: 'Uel' },
  { label: 'PUC', value: 'PUC' },
  { label: 'UNICAMP', value: 'Unicamp' },
  { label: 'UECE', value: 'UECE' },
  { label: 'UGEM', value: 'UGEM' },
  { label: 'UFRRJ', value: 'UFRRJ' },
  { label: 'SESI editora', value: 'SESI editora' },
];

const difficulties: FilterChoice[] = [
  { label: 'Todas', value: '' },
  { label: 'Baixa', value: 'Baixa' },
  { label: 'Média', value: 'Média' },
  { label: 'Alta', value: 'Alta' },
];

const subjectConfig: Record<Subject, { title: string; topics: FilterChoice[]; description: string }> = {
  grammar: {
    title: 'Gramática',
    description: 'Pratique os temas de gramática cobrados nos vestibulares.',
    topics: [
      { label: 'Todos', value: '' },
      { label: 'Variação Linguística', value: 'Variação Linguística' },
      { label: 'Análise Sintática', value: 'Análise Sintática' },
    ],
  },
  literature: {
    title: 'Literatura',
    description: 'Explore escolas literárias e revise conteúdos para as provas.',
    topics: [
      { label: 'Todos', value: '' },
      { label: 'Modernismo', value: 'Modernismo' },
      { label: 'Romantismo', value: 'Romantismo' },
    ],
  },
};

type FilterRowProps = {
  title: string;
  choices: FilterChoice[];
  selected: string;
  onSelect: (value: string) => void;
};

function FilterRow({ title, choices, selected, onSelect }: FilterRowProps) {
  return (
    <View style={styles.filterGroup}>
      <Text style={styles.filterTitle}>{title}</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.filterChoices}
        showsHorizontalScrollIndicator={false}>
        {choices.map((choice) => {
          const isSelected = selected === choice.value;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              key={`${title}-${choice.value}`}
              onPress={() => onSelect(choice.value)}
              style={[styles.filterChip, isSelected && styles.selectedChip]}>
              <Text style={[styles.filterLabel, isSelected && styles.selectedFilterLabel]}>
                {choice.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function QuestionCard({ question, index }: { question: Question; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const alternatives = [
    question.alternativa_a,
    question.alternativa_b,
    question.alternativa_c,
    question.alternativa_d,
    question.alternativa_e,
  ].filter(Boolean);

  return (
    <View style={styles.questionCard}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((isExpanded) => !isExpanded)}
        style={styles.questionTrigger}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>QUESTÃO {index + 1}</Text>
          <Text style={styles.expandIcon}>{expanded ? '−' : '+'}</Text>
        </View>
        <Text style={styles.questionText}>{question.enunciado}</Text>
        {alternatives.map((alternative, alternativeIndex) => (
          <Text key={`${question.id}-${alternativeIndex}`} style={styles.alternative}>
            {alternative}
          </Text>
        ))}
        <Text style={styles.tapHint}>{expanded ? 'Toque para recolher' : 'Toque para ver a resposta'}</Text>
      </Pressable>

      {expanded ? (
        <View style={styles.answer}>
          {question.resposta ? (
            <Text style={styles.answerText}>
              <Text style={styles.answerLabel}>Resposta: </Text>
              {question.resposta}
            </Text>
          ) : null}
          {question.comentario ? (
            <Text style={styles.answerText}>
              <Text style={styles.answerLabel}>Comentário: </Text>
              {question.comentario}
            </Text>
          ) : null}
          {question.material ? (
            <Text style={styles.answerText}>
              <Text style={styles.answerLabel}>Material de apoio: </Text>
              {question.material}
            </Text>
          ) : null}
          {!question.resposta && !question.comentario && !question.material ? (
            <Text style={styles.answerText}>Esta questão não possui comentário cadastrado.</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export function QuestionBankScreen({ subject }: { subject: Subject }) {
  const config = subjectConfig[subject];
  const [topic, setTopic] = useState('');
  const [institution, setInstitution] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadQuestions() {
      setIsLoading(true);
      setError('');

      try {
        const result = await fetchQuestions({ topic, institution, difficulty }, controller.signal);
        setQuestions(result);
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Não foi possível carregar as questões.',
          );
          setQuestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadQuestions();

    return () => controller.abort();
  }, [topic, institution, difficulty, refreshKey]);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <TopBar />
      <FlatList
        data={questions}
        keyExtractor={(question) => String(question.id)}
        renderItem={({ item, index }) => <QuestionCard question={item} index={index} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.pageTitle}>{config.title}</Text>
            <Text style={styles.pageDescription}>{config.description}</Text>
            <View style={styles.filters}>
              <FilterRow
                title="Matéria"
                choices={config.topics}
                selected={topic}
                onSelect={setTopic}
              />
              <FilterRow
                title="Banca"
                choices={institutions}
                selected={institution}
                onSelect={setInstitution}
              />
              <FilterRow
                title="Dificuldade"
                choices={difficulties}
                selected={difficulty}
                onSelect={setDifficulty}
              />
            </View>
            <View style={styles.resultsSummary}>
              <Text style={styles.resultsTitle}>Questões</Text>
              {isLoading ? (
                <ActivityIndicator color={AppColors.wine} size="small" />
              ) : (
                <Text style={styles.resultsCount}>{questions.length}</Text>
              )}
            </View>
            {error ? (
              <View accessibilityRole="alert" style={styles.errorCard}>
                <Text style={styles.errorTitle}>Não foi possível carregar as questões</Text>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setRefreshKey((key) => key + 1)}
                  style={styles.retryButton}>
                  <Text style={styles.retryLabel}>Tentar novamente</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator color={AppColors.wine} size="large" />
              <Text style={styles.emptyText}>Buscando questões...</Text>
            </View>
          ) : error ? null : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nenhuma questão encontrada</Text>
              <Text style={styles.emptyText}>Tente alterar os filtros e buscar novamente.</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: AppColors.cream,
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  pageTitle: {
    color: AppColors.wine,
    fontSize: 34,
    fontWeight: '900',
    marginTop: 8,
  },
  pageDescription: {
    color: AppColors.ink,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 5,
    marginBottom: 18,
  },
  filters: {
    backgroundColor: AppColors.wine,
    borderRadius: 20,
    gap: 14,
    padding: 16,
  },
  filterGroup: {
    gap: 8,
  },
  filterTitle: {
    color: AppColors.cream,
    fontSize: 14,
    fontWeight: '800',
  },
  filterChoices: {
    gap: 8,
    paddingRight: 12,
  },
  filterChip: {
    backgroundColor: AppColors.rose,
    borderColor: 'transparent',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  selectedChip: {
    backgroundColor: AppColors.cream,
    borderColor: AppColors.cream,
  },
  filterLabel: {
    color: AppColors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  selectedFilterLabel: {
    color: AppColors.wine,
  },
  resultsSummary: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 12,
  },
  resultsTitle: {
    color: AppColors.wine,
    fontSize: 20,
    fontWeight: '800',
  },
  resultsCount: {
    backgroundColor: AppColors.white,
    borderRadius: 14,
    color: AppColors.wine,
    fontSize: 13,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  questionCard: {
    backgroundColor: AppColors.wine,
    borderRadius: 20,
    marginBottom: 12,
    overflow: 'hidden',
  },
  questionTrigger: {
    padding: 18,
  },
  questionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  questionNumber: {
    color: AppColors.cream,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  expandIcon: {
    color: AppColors.cream,
    fontSize: 22,
    fontWeight: '600',
  },
  questionText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
  },
  alternative: {
    color: AppColors.white,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  tapHint: {
    color: AppColors.cream,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 12,
  },
  answer: {
    borderTopColor: 'rgba(255,255,255,0.5)',
    borderTopWidth: 1,
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  answerText: {
    color: AppColors.white,
    fontSize: 14,
    lineHeight: 21,
  },
  answerLabel: {
    color: AppColors.cream,
    fontWeight: '800',
  },
  errorCard: {
    backgroundColor: '#F8E3DD',
    borderRadius: 16,
    marginTop: 14,
    padding: 16,
  },
  errorTitle: {
    color: AppColors.danger,
    fontSize: 15,
    fontWeight: '800',
  },
  errorText: {
    color: AppColors.ink,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.wine,
    borderRadius: 10,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  retryLabel: {
    color: AppColors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: 18,
    gap: 8,
    marginTop: 8,
    padding: 24,
  },
  emptyTitle: {
    color: AppColors.wine,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyText: {
    color: AppColors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
