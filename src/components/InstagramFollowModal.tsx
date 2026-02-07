import React, { useState } from 'react';
import { Instagram, Download, X, ExternalLink, Heart, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface InstagramFollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmFollow: () => void;
  participantName: string;
}

const INSTAGRAM_URL = 'https://www.instagram.com/raqeem_jo/';
const FOLLOWED_KEY = 'raqeem_instagram_followed';

export const hasFollowedInstagram = (): boolean => {
  return localStorage.getItem(FOLLOWED_KEY) === 'true';
};

export const setFollowedInstagram = (): void => {
  localStorage.setItem(FOLLOWED_KEY, 'true');
};

export const InstagramFollowModal: React.FC<InstagramFollowModalProps> = ({
  isOpen,
  onClose,
  onConfirmFollow,
  participantName,
}) => {
  const [step, setStep] = useState<'request' | 'confirm'>('request');

  const handleOpenInstagram = () => {
    window.open(INSTAGRAM_URL, '_blank');
    setStep('confirm');
  };

  const handleConfirmFollow = () => {
    setFollowedInstagram();
    onConfirmFollow();
    onClose();
    setStep('request');
  };

  const handleClose = () => {
    onClose();
    setStep('request');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {step === 'request' ? 'قبل تحميل الشهادة 📱' : 'هل قمت بالمتابعة؟ ✨'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {step === 'request' ? (
            <div className="text-center space-y-6">
              {/* Instagram Icon */}
              <div className="relative inline-flex">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shadow-lg animate-pulse-soft">
                  <Instagram className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-md">
                  <Heart className="w-4 h-4 text-white fill-white" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">
                  مرحباً {participantName}! 👋
                </p>
                <p className="text-muted-foreground">
                  لتحميل شهادتك، نتمنى أن تتابعنا على إنستجرام لتبقى على اطلاع بآخر الدورات والفعاليات
                </p>
              </div>

              <Button
                onClick={handleOpenInstagram}
                className="w-full h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:opacity-90 text-white font-semibold rounded-xl"
              >
                <Instagram className="w-5 h-5 ml-2" />
                متابعة @raqeem_jo
                <ExternalLink className="w-4 h-4 mr-2" />
              </Button>

              <p className="text-xs text-muted-foreground">
                تابعنا للحصول على أحدث الدورات التقنية والفرص التعليمية
              </p>
            </div>
          ) : (
            <div className="text-center space-y-6">
              {/* Confirmation Icon */}
              <div className="relative inline-flex">
                <div className="w-24 h-24 rounded-2xl bg-gradient-raqeem flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">
                  شكراً لمتابعتك! 🎉
                </p>
                <p className="text-muted-foreground">
                  اضغط على الزر أدناه لتحميل شهادتك
                </p>
              </div>

              <Button
                onClick={handleConfirmFollow}
                className="w-full h-12 raqeem-button"
              >
                <Download className="w-5 h-5 ml-2" />
                تحميل الشهادة الآن
              </Button>

              <button
                onClick={handleOpenInstagram}
                className="text-sm text-primary hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <Instagram className="w-4 h-4" />
                لم أتابع بعد - افتح انستجرام
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
