import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import raqeemLogo from '@/assets/raqeem-logo.png';

const ADMIN_PASSWORD = 'baderdot12';

const AdminGateway: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminAccess', 'true');
        navigate('/dashboard');
      } else {
        setError('كلمة المرور غير صحيحة');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 sm:w-[400px] h-72 sm:h-[400px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="glass-panel-strong p-6 sm:p-8">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <img 
              src={raqeemLogo} 
              alt="رقيم" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain mx-auto mb-4"
            />
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-raqeem flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              بوابة الأدمن
            </h1>
            <p className="text-sm text-muted-foreground">
              أدخل كلمة المرور للوصول إلى نظام إنشاء الشهادات
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-center text-lg pr-12 rounded-xl border-2 focus:border-primary"
                dir="ltr"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={!password || isLoading}
              className="w-full h-12 raqeem-button"
            >
              {isLoading ? 'جاري التحقق...' : 'دخول'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="w-full text-muted-foreground"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للصفحة الرئيسية
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          هذه البوابة مخصصة للمشرفين فقط
        </p>
      </div>
    </div>
  );
};

export default AdminGateway;
