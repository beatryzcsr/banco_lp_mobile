const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '') ?? 'https://banco-de-portugues.vercel.app';

export type QuestionFilters = {
  topic?: string;
  institution?: string;
  difficulty?: string;
};

export type Question = {
  id: string | number;
  enunciado: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  alternativa_e: string;
  resposta: string;
  comentario: string;
  material: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readMessage(value: unknown) {
  if (isRecord(value) && typeof value.mensagem === 'string') {
    return value.mensagem;
  }

  return null;
}

async function request(path: string, init?: RequestInit): Promise<unknown> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, init);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new Error('Não foi possível conectar à API. Verifique sua conexão e a URL configurada.');
    }

    throw error;
  }

  const responseText = await response.text();
  let body: unknown = null;

  if (responseText) {
    try {
      body = JSON.parse(responseText) as unknown;
    } catch {
      if (!response.ok) {
        throw new Error(
          `A API respondeu com erro HTTP ${response.status}. Verifique se o serviço está publicado.`,
        );
      }

      throw new Error('A API retornou uma resposta inválida.');
    }
  }

  if (!response.ok) {
    throw new Error(readMessage(body) ?? `A API respondeu com erro HTTP ${response.status}.`);
  }

  return body;
}

export async function login(email: string, password: string) {
  const body = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!isRecord(body) || typeof body.token !== 'string' || body.token.length === 0) {
    throw new Error('A API não retornou um token de acesso válido.');
  }

  return body.token;
}

function readString(record: Record<string, unknown>, key: string) {
  const value = record[key];

  if (value === undefined || value === null) {
    return '';
  }

  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error(`A API retornou um valor inválido no campo "${key}".`);
  }

  return String(value);
}

function parseQuestion(value: unknown, index: number): Question {
  if (!isRecord(value)) {
    throw new Error('A API retornou uma questão em formato inválido.');
  }

  const enunciado = readString(value, 'enunciado');

  if (!enunciado.trim()) {
    throw new Error(`A questão ${index + 1} veio sem enunciado.`);
  }

  const material =
    readString(value, 'material') ||
    readString(value, 'material_apoio') ||
    readString(value, 'material_de_apoio');
  const id = value.idq;

  return {
    id: typeof id === 'string' || typeof id === 'number' ? id : index,
    enunciado,
    alternativa_a: readString(value, 'alternativa_a'),
    alternativa_b: readString(value, 'alternativa_b'),
    alternativa_c: readString(value, 'alternativa_c'),
    alternativa_d: readString(value, 'alternativa_d'),
    alternativa_e: readString(value, 'alternativa_e'),
    resposta: readString(value, 'resposta'),
    comentario: readString(value, 'comentario'),
    material,
  };
}

export async function fetchQuestions(filters: QuestionFilters, signal: AbortSignal) {
  const query = new URLSearchParams();

  if (filters.topic) query.set('nomet', filters.topic);
  if (filters.institution) query.set('instituicao', filters.institution);
  if (filters.difficulty) query.set('nomed', filters.difficulty);

  const queryString = query.toString();
  const suffix = queryString ? `?${queryString}` : '';
  const body = await request(`/api/questoes${suffix}`, { signal });

  if (!Array.isArray(body)) {
    throw new Error('A API de questões retornou um formato inesperado.');
  }

  return body.map(parseQuestion);
}
