import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Award, GraduationCap, BookOpen, Users, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import raqeemLogo from '@/assets/raqeem-logo.png';

const Home: React.FC = () => {
  const [searchName, setSearchName] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchName.trim()) {
      navigate(`/certificates/${encodeURIComponent(searchName.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={raqeemLogo} alt="رقيم" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">
                  رقيم
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  منصة الشهادات التعليمية
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/verify')}
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">التحقق من شهادة</span>
              <span className="sm:hidden">تحقق</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 lg:py-28 overflow-hidden bg-gradient-hero">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo Badge */}
            <div className="inline-flex items-center justify-center mb-6 sm:mb-8">
              <div className="relative">
                <img 
                  src={raqeemLogo} 
                  alt="رقيم" 
                  className="w-24 h-24 sm:w-32 sm:h-32 object-contain animate-float"
                />
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl -z-10" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              مرحباً بك في
              <span className="text-gradient-raqeem block mt-2">منصة رقيم التعليمية</span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-xl mx-auto px-4">
              ابحث عن شهاداتك التي حصلت عليها من خلال دوراتنا التدريبية وورش العمل المتخصصة
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto px-4">
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="أدخل اسمك الكامل..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="h-12 sm:h-14 text-base sm:text-lg pr-12 pl-4 rounded-xl border-2 border-border focus:border-primary bg-card shadow-soft"
                  dir="rtl"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
              <Button
                type="submit"
                disabled={!searchName.trim()}
                className="w-full h-12 sm:h-14 text-base sm:text-lg raqeem-button disabled:opacity-50"
              >
                <Search className="w-5 h-5 ml-2" />
                البحث عن شهاداتي
              </Button>
            </form>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/verify')}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                <ShieldCheck className="w-4 h-4 ml-1" />
                التحقق من شهادة برقمها
                <ArrowLeft className="w-4 h-4 mr-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-xl sm:text-2xl font-bold text-center text-foreground mb-8 sm:mb-12">
            لماذا منصة رقيم؟
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            <div className="glass-panel p-5 sm:p-6 text-center card-hover">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-raqeem flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h4 className="font-bold text-base sm:text-lg text-foreground mb-2">
                شهادات معتمدة
              </h4>
              <p className="text-sm text-muted-foreground">
                جميع الشهادات صادرة ومعتمدة رسمياً من منصة رقيم التعليمية
              </p>
            </div>

            <div className="glass-panel p-5 sm:p-6 text-center card-hover">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-raqeem flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h4 className="font-bold text-base sm:text-lg text-foreground mb-2">
                دورات متنوعة
              </h4>
              <p className="text-sm text-muted-foreground">
                مجموعة واسعة من الدورات التدريبية وورش العمل المتخصصة
              </p>
            </div>

            <div className="glass-panel p-5 sm:p-6 text-center card-hover sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-raqeem flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h4 className="font-bold text-base sm:text-lg text-foreground mb-2">
                سهولة التحقق
              </h4>
              <p className="text-sm text-muted-foreground">
                يمكنك التحقق من صحة أي شهادة عبر رمز QR أو رقم الشهادة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 sm:py-8 mt-auto bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={raqeemLogo} alt="رقيم" className="w-8 h-8 object-contain" />
              <span className="text-sm font-medium text-muted-foreground">منصة رقيم التعليمية</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
              © {new Date().getFullYear()} جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
