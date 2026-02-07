import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

    // Simple password check - NOT secure for production
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Store admin session in sessionStorage (cleared when browser closes)
        sessionStorage.setItem('adminAccess', 'true');
        navigate('/certgen');
      } else {
        setError('كلمة المرور غير صحيحة');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="glass-panel p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
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
                className="h-12 text-center text-lg pr-12"
                dir="ltr"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={!password || isLoading}
              className="w-full h-12 navy-button"
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
