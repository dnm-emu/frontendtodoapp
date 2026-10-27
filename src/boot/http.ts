import { boot } from 'quasar/wrappers';
import { wireAuth } from 'src/http/client';
import { refreshRequest } from 'src/http/sessionApi';
import { useSessionStore } from 'src/stores/sessionStore';

export default boot(() => {
  wireAuth({
    token: () => useSessionStore().accessToken,
    renew: async () => {
      const session = useSessionStore();
      if (!session.accessToken) return null;
      const result = await refreshRequest(session.accessToken);
      if (!result.ok) {
        session.signOut();
        return null;
      }
      session.putToken(result.value.accessToken);
      return result.value.accessToken;
    },
  });
});
