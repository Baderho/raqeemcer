import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Award, GraduationCap, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-gold-dark flex items-center justify-center shadow-gold">
                <GraduationCap className="w-7 h-7 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  منصة رقيم التعليمية
                </h1>
                <p className="text-xs text-muted-foreground">
                  منصة التحقق من الشهادات
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-sm font-medium text-accent mb-6">
              <Award className="w-4 h-4" />
              <span>شهادات معتمدة وموثقة</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
              ابحث عن شهاداتك
              <span className="text-gradient-gold block mt-2">في منصة رقيم التعليمية</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              أدخل اسمك للبحث عن جميع الشهادات التي حصلت عليها من خلال دوراتنا التدريبية وورش العمل
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="أدخل اسمك الكامل..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="h-14 text-lg pr-14 pl-4 rounded-xl border-2 border-border focus:border-accent bg-card shadow-soft"
                  dir="rtl"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
              <Button
                type="submit"
                disabled={!searchName.trim()}
                className="w-full mt-4 h-12 text-lg gold-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                البحث عن شهاداتي
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass-panel p-6 text-center">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                شهادات معتمدة
              </h3>
              <p className="text-sm text-muted-foreground">
                جميع الشهادات صادرة ومعتمدة رسمياً من منصة رقيم التعليمية
              </p>
            </div>

            <div className="glass-panel p-6 text-center">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                دورات متنوعة
              </h3>
              <p className="text-sm text-muted-foreground">
                مجموعة واسعة من الدورات التدريبية وورش العمل المتخصصة
              </p>
            </div>

            <div className="glass-panel p-6 text-center">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                سهولة التحقق
              </h3>
              <p className="text-sm text-muted-foreground">
                يمكنك التحقق من صحة أي شهادة عبر رمز QR الموجود عليها
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} منصة رقيم التعليمية - جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
