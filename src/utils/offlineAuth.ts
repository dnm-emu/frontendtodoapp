import type { SignInResult } from 'src/types/account';

const GUESTS = [
  { id: 1, email: 'user@test.com', password: '123456', name: 'Студент' },
  { id: 2, email: 'admin@test.com', password: 'admin123', name: 'Преподаватель' },
] as const;

export function isOfflineToken(token: string | null): boolean {
  return token?.startsWith('offline-session-') ?? false;
}

export function tryOfflineSignIn(email: string, password: string): SignInResult | null {
  const guest = GUESTS.find(
    (item) => item.email === email.trim().toLowerCase() && item.password === password,
  );

  if (!guest) return null;

  return {
    accessToken: `offline-session-${guest.id}`,
    account: { id: guest.id, email: guest.email, name: guest.name },
  };
}
