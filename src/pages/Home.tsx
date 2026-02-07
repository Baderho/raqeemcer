import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, Award, GraduationCap, BookOpen, Users, ShieldCheck, 
  ArrowLeft, Sparkles, Rocket, Code, Laptop, Heart, Instagram
} from 'lucide-react';
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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.img 
                src={raqeemLogo} 
                alt="رقيم" 
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                whileHover={{ scale: 1.05 }}
              />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">
                  رقيم
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  تمكين الشباب بالتقنية
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/raqeem_jo/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-pink-500 hover:bg-pink-500/10 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
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
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-0 left-0 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Badge */}
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>مبادرة تمكين الشباب بالتقنية</span>
            </motion.div>

            {/* Logo */}
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center justify-center mb-8"
            >
              <div className="relative">
                <motion.img 
                  src={raqeemLogo} 
                  alt="رقيم" 
                  className="w-28 h-28 sm:w-36 sm:h-36 object-contain"
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl -z-10 scale-150" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight"
            >
              مرحباً بك في
              <span className="text-gradient-raqeem block mt-2">منصة رقيم التعليمية</span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p 
              variants={fadeInUp}
              className="text-lg sm:text-xl text-muted-foreground mb-4 max-w-xl mx-auto px-4"
            >
              ابحث عن شهاداتك التي حصلت عليها من دوراتنا التدريبية وورش العمل المتخصصة
            </motion.p>

            {/* Nahno Credit */}
            <motion.div 
              variants={fadeInUp}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8"
            >
              <span>من إبداعات</span>
              <a 
                href="https://nahno.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                منصة نحن
              </a>
            </motion.div>

            {/* Search Form */}
            <motion.form 
              variants={fadeInUp}
              onSubmit={handleSearch} 
              className="max-w-lg mx-auto px-4"
            >
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="أدخل اسمك الكامل..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="h-14 sm:h-16 text-lg sm:text-xl pr-14 pl-4 rounded-2xl border-2 border-border focus:border-primary bg-card shadow-lg"
                  dir="rtl"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
              <Button
                type="submit"
                disabled={!searchName.trim()}
                className="w-full h-14 sm:h-16 text-lg sm:text-xl raqeem-button disabled:opacity-50 rounded-2xl"
              >
                <Search className="w-6 h-6 ml-2" />
                البحث عن شهاداتي
              </Button>
            </motion.form>

            {/* Quick Actions */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-4 mt-8"
            >
              <Button
                variant="ghost"
                onClick={() => navigate('/verify')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ShieldCheck className="w-5 h-5 ml-2" />
                التحقق من شهادة برقمها
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              لماذا منصة رقيم؟
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              نسعى لتمكين الشباب العربي بالمهارات التقنية اللازمة لبناء مستقبل رقمي مشرق
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Award, title: 'شهادات معتمدة', desc: 'جميع الشهادات صادرة ومعتمدة رسمياً من منصة رقيم' },
              { icon: Code, title: 'دورات برمجية', desc: 'تعلم أحدث لغات البرمجة والتقنيات الحديثة' },
              { icon: Laptop, title: 'ورش عمل تفاعلية', desc: 'تطبيق عملي مباشر مع مدربين متخصصين' },
              { icon: ShieldCheck, title: 'سهولة التحقق', desc: 'يمكنك التحقق من صحة أي شهادة عبر رمز QR' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-panel p-6 text-center cursor-default"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-raqeem flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h4 className="font-bold text-lg text-foreground mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-gradient-raqeem">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: '500+', label: 'شهادة صادرة' },
              { value: '20+', label: 'دورة تدريبية' },
              { value: '50+', label: 'ورشة عمل' },
              { value: '300+', label: 'متدرب' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-1">{stat.value}</p>
                <p className="text-sm sm:text-base text-primary-foreground/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-panel-strong max-w-3xl mx-auto p-8 sm:p-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-raqeem flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Rocket className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              انضم لمجتمع رقيم
            </h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              تابعنا على انستجرام للحصول على آخر أخبار الدورات التدريبية والفرص التعليمية
            </p>
            <a
              href="https://www.instagram.com/raqeem_jo/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
            >
              <Instagram className="w-5 h-5" />
              تابعنا على انستجرام
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={raqeemLogo} alt="رقيم" className="w-8 h-8 object-contain" />
              <div>
                <span className="text-sm font-medium text-foreground">منصة رقيم التعليمية</span>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  من إبداعات
                  <a href="https://nahno.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    منصة نحن
                  </a>
                  <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/raqeem_jo/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-pink-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              © {new Date().getFullYear()} جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
