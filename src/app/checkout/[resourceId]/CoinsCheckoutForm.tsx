'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { PurchaseFormState } from '@/actions/purchase-actions';

type Props = {
  action: (state: PurchaseFormState, formData: FormData) => Promise<PurchaseFormState>;
  resourceId: string;
  coinPrice: number;
  coinBalance: number;
  alreadyPurchased: boolean;
  supportsCoins: boolean;
};

const initialFormState: PurchaseFormState = { status: 'idle', message: '' };

export function CoinsCheckoutForm({
  action,
  resourceId,
  coinPrice,
  coinBalance,
  alreadyPurchased,
  supportsCoins,
}: Props) {
  const [state, formAction] = useActionState(action, initialFormState);
  const router = useRouter();

  const disabledBase = alreadyPurchased || !supportsCoins || coinBalance < coinPrice;

  useEffect(() => {
    if (state.status === 'idle') return;

    if (state.status === 'success') {
      toast.success(state.message || 'Purchase completed.');
      router.push('/project-files');
      router.refresh();
    }

    if (state.status === 'error' && state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="resourceId" value={resourceId} />
      <input type="hidden" name="paymentMethod" value="COINS" />

      {state.status === 'error' && state.message && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
          {state.message}
        </div>
      )}

      {alreadyPurchased && (
        <div className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-foreground">
          You already own this resource.
        </div>
      )}

      {!supportsCoins && (
        <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          This resource is not available for coins. Choose another payment option.
        </div>
      )}

      <SubmitButton
        disabled={disabledBase}
        coinPrice={coinPrice}
        coinBalance={coinBalance}
        alreadyPurchased={alreadyPurchased}
      />
    </form>
  );
}

function SubmitButton({
  disabled,
  coinPrice,
  coinBalance,
  alreadyPurchased,
}: {
  disabled: boolean;
  coinPrice: number;
  coinBalance: number;
  alreadyPurchased: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      disabled={disabled || pending}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          Processing...
        </span>
      ) : alreadyPurchased ? (
        'Already purchased'
      ) : coinBalance < coinPrice ? (
        'Not enough coins'
      ) : (
        `Pay ${coinPrice} coins`
      )}
    </Button>
  );
}