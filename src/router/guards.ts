import type { Router } from 'vue-router';
import { useSessionStore } from 'src/stores/sessionStore';

export function attachGuards(router: Router): void {
  router.beforeEach((to, _from, next) => {
    const session = useSessionStore();

    if (to.meta.private && !session.signedIn) {
      next({ name: 'signin', query: { next: to.fullPath } });
      return;
    }

    if (to.meta.publicOnly && session.signedIn) {
      next({ name: 'board' });
      return;
    }

    next();
  });
}
