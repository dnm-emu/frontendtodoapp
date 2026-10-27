import { describe, expect, it } from 'vitest';
import { collectZodMessages, newTaskSchema, signInSchema, titleRule } from 'src/utils/schemas';

describe('schemas', () => {
  it('accepts a valid sign-in payload', () => {
    const result = signInSchema.safeParse({ email: 'user@test.com', password: '123456' });
    expect(result.success).toBe(true);
  });

  it('rejects a short password', () => {
    const result = signInSchema.safeParse({ email: 'user@test.com', password: '12' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(collectZodMessages(result.error).password).toMatch(/минимум/i);
    }
  });

  it('rejects an empty task title', () => {
    const result = newTaskSchema.safeParse({ title: '   ' });
    expect(result.success).toBe(false);
  });

  it('trims a valid title', () => {
    const result = titleRule.safeParse('  Купить тетрадь  ');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('Купить тетрадь');
    }
  });
});
