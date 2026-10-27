import { useLookStore } from 'src/stores/lookStore';
import { dumpFault, groupFault, pickFaultText } from 'src/utils/faults';
import type { Fault } from 'src/types/fault';
import type { ToastPayload } from 'src/types/look';

export function useNotifyErrors() {
  const look = useLookStore();

  function catchFault(fault: Fault, place?: string, retry?: () => void): void {
    dumpFault(fault, place);

    const toast: ToastPayload = {
      tone: 'negative',
      text: pickFaultText(fault),
    };

    if (retry && groupFault(fault) === 'net') {
      toast.action = { caption: 'Ещё раз', run: retry };
    }

    look.pushToast(toast);
  }

  return { catchFault };
}
