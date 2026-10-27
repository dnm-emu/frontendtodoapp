import { z } from 'zod';

export const mailRule = z.string().trim().min(1, 'Укажите почту').email('Почта указана неверно');

export const secretRule = z
  .string()
  .min(6, 'Пароль — минимум 6 символов')
  .max(64, 'Пароль слишком длинный');

export const titleRule = z
  .string()
  .trim()
  .min(1, 'Название не может быть пустым')
  .max(180, 'Сократите название до 180 символов');

export const signInSchema = z.object({
  email: mailRule,
  password: secretRule,
});

export const newTaskSchema = z.object({
  title: titleRule,
});

export type FieldMap = Record<string, string>;

export function collectZodMessages(error: z.ZodError): FieldMap {
  const map: FieldMap = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString() ?? 'form';
    if (!map[key]) {
      map[key] = issue.message;
    }
  }
  return map;
}

export async function probeEmailTaken(email: string): Promise<string | null> {
  try {
    const base = import.meta.env.VITE_API_URL || '/api';
    const response = await fetch(`${base}/users?email=${encodeURIComponent(email)}`);
    if (!response.ok) return null;
    const rows = (await response.json()) as Array<{ email: string }>;
    return rows.length > 0 ? 'Эта почта уже занята' : null;
  } catch {
    return null;
  }
}
