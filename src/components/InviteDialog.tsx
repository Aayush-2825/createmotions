'use client';

import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Copy, Link2, Share2, UserPlus2 } from 'lucide-react';

type InviteDialogProps = {
  referralCode: string;
  trigger?: ReactNode;
};

type FeedbackTarget = 'code' | 'link' | 'share';

export function InviteDialog({ referralCode, trigger }: InviteDialogProps) {
  const [origin, setOrigin] = useState('');
  const [canShare, setCanShare] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackTarget | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrigin(window.location.origin);
      setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
    }

    return () => {
      if (feedbackTimer.current) {
        clearTimeout(feedbackTimer.current);
      }
    };
  }, []);

  const inviteLink = useMemo(() => {
    const baseUrl = origin || process.env.NEXT_PUBLIC_APP_URL || '';

    if (!baseUrl) return '';

    const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${normalizedBase}/referral/?ref=${encodeURIComponent(referralCode)}`;
  }, [origin, referralCode]);

  const setFeedbackWithTimeout = (target: FeedbackTarget) => {
    if (feedbackTimer.current) {
      clearTimeout(feedbackTimer.current);
    }

    setFeedback(target);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 1800);
  };

  const copyToClipboard = async (value: string, target: FeedbackTarget) => {
    if (!value) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setFeedbackWithTimeout(target);
    } catch (error) {
      console.error('Failed to copy value to clipboard', error);
      setFeedbackWithTimeout(target);
    }
  };

  const handleShare = async () => {
    if (!inviteLink) return;

    const shareMessage = `Join me with my referral code ${referralCode}.`;

    try {
      if (canShare && navigator.share) {
        await navigator.share({
          title: 'Invite a friend',
          text: shareMessage,
          url: inviteLink,
        });

        setFeedbackWithTimeout('share');
        return;
      }
    } catch (error) {
      console.error('Native share failed, falling back to copy', error);
    }

    await copyToClipboard(inviteLink, 'link');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <UserPlus2 className="size-4" />
            Invite friends
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a friend</DialogTitle>
          <DialogDescription>
            Share your personal link or referral code to invite teammates.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-link">Referral link</Label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                id="invite-link"
                value={inviteLink || ''}
                readOnly
                placeholder="Link will be ready in a moment"
                className="font-mono"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(inviteLink, 'link')}
                disabled={!inviteLink}
              >
                <Link2 className="size-4" />
                {feedback === 'link' ? 'Copied' : 'Copy link'}
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="referral-code">Referral code</Label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                id="referral-code"
                value={referralCode}
                readOnly
                className="font-mono uppercase"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(referralCode, 'code')}
                disabled={!referralCode}
              >
                <Copy className="size-4" />
                {feedback === 'code' ? 'Copied' : 'Copy code'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Friends can enter this code at sign-up if they already have the link.
            </p>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              className="w-full sm:w-auto"
              onClick={handleShare}
              disabled={!inviteLink}
            >
              <Share2 className="size-4" />
              {feedback === 'share'
                ? 'Shared'
                : canShare
                  ? 'Share invite'
                  : 'Copy link'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
