import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Award, ShieldCheck, Sparkles, Zap, Binary, Cpu, CircuitBoard, Braces, Instagram } from 'lucide-react';
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
  return <div className="min-h-screen bg-background overflow-hidden" dir="rtl">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px] animate-pulse-soft" style={{
        animationDelay: '2s'
      }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-primary/3 to-transparent rounded-full" />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => <motion.div key={i} className="absolute w-1 h-1 bg-primary/30 rounded-full" style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`
      }} animate={{
        y: [0, -30, 0],
        opacity: [0.3, 0.8, 0.3]
      }} transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 2
      }} />)}
      </div>

      {/* Header */}
      <header className="border-b border-primary/10 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div className="flex items-center gap-3" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }}>
              <div className="relative">
                <img src={raqeemLogo} alt="رقيم" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg -z-10" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-l from-primary to-cyan-400 bg-clip-text text-transparent">
                  رقيم
                </h1>
                <p className="text-[10px] text-muted-foreground tracking-wider">RAQEEM.AI</p>
              </div>
            </motion.div>

            <motion.div className="flex items-center gap-3" initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }}>
              <a href="https://www.instagram.com/raqeem_jo/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl text-muted-foreground hover:text-pink-500 hover:bg-pink-500/10 transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <Button variant="outline" size="sm" onClick={() => navigate('/verify')} className="border-primary/30 hover:border-primary hover:bg-primary/10 text-xs sm:text-sm rounded-xl">
                <ShieldCheck className="w-4 h-4 ml-1" />
                <span className="hidden sm:inline">التحقق</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* AI Badge */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.1
          }} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-8">
              <Sparkles className="w-4 h-4" />
              <span>منصة الشهادات الذكية</span>
              <Zap className="w-4 h-4" />
            </motion.div>

            {/* Logo with Glow */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.8
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: 0.2,
            type: "spring"
          }} className="relative inline-block mb-8">
              
              <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-cyan-400/40 rounded-full blur-3xl scale-150 -z-10 animate-pulse-soft" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl -z-10" />
            </motion.div>

            {/* Title */}
            <motion.h2 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3
          }} className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">مرحباً بك في</span>
              <br />
              <span className="bg-gradient-to-l from-primary via-cyan-400 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                منصة رقيم
              </span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4
          }} className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              منصة ذكية لإدارة وإصدار الشهادات التعليمية
              <br className="hidden sm:block" />
              <span className="text-primary">ابحث عن شهاداتك الآن</span>
            </motion.p>

            {/* Search Form */}
            <motion.form initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.5
          }} onSubmit={handleSearch} className="max-w-xl mx-auto px-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-cyan-400/50 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative bg-background border-2 border-primary/20 rounded-2xl p-2 focus-within:border-primary/50 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input type="text" placeholder="أدخل اسمك الكامل..." value={searchName} onChange={e => setSearchName(e.target.value)} className="h-14 text-lg pr-12 pl-4 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0" dir="rtl" />
                    </div>
                    <Button type="submit" disabled={!searchName.trim()} className="h-14 px-8 text-lg font-semibold bg-gradient-to-l from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 rounded-xl disabled:opacity-50 transition-all duration-300 shadow-lg shadow-primary/25">
                      <Search className="w-5 h-5 ml-2" />
                      بحث
                    </Button>
                  </div>
                </div>
              </div>
            </motion.form>

            {/* Quick Actions */}
            <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.6
          }} className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Button variant="ghost" onClick={() => navigate('/verify')} className="text-muted-foreground hover:text-primary group">
                <ShieldCheck className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                التحقق من شهادة برقمها
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[Binary, Cpu, CircuitBoard, Braces].map((Icon, i) => <motion.div key={i} className="absolute text-primary/10" style={{
          top: `${20 + i * 20}%`,
          left: i % 2 === 0 ? '5%' : '90%'
        }} animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }} transition={{
          duration: 4 + i,
          repeat: Infinity,
          delay: i * 0.5
        }}>
              <Icon className="w-12 h-12 sm:w-16 sm:h-16" />
            </motion.div>)}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-l from-primary to-cyan-400 bg-clip-text text-transparent">
                مميزات المنصة
              </span>
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              تقنيات متقدمة لإدارة الشهادات التعليمية
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[{
            icon: Award,
            title: 'شهادات موثقة',
            desc: 'كل شهادة تحمل رمز QR للتحقق الفوري من صحتها',
            gradient: 'from-primary to-cyan-400'
          }, {
            icon: Zap,
            title: 'بحث سريع',
            desc: 'ابحث عن شهاداتك باسمك خلال ثوانٍ معدودة',
            gradient: 'from-cyan-400 to-blue-500'
          }, {
            icon: ShieldCheck,
            title: 'تحقق فوري',
            desc: 'امسح رمز QR أو أدخل رقم الشهادة للتحقق',
            gradient: 'from-blue-500 to-primary'
          }].map((feature, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} whileHover={{
            y: -8,
            scale: 1.02
          }} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-cyan-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-8 h-full hover:border-primary/30 transition-colors">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="font-bold text-xl text-foreground mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} viewport={{
          once: true
        }} className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-cyan-400/30 rounded-3xl blur-2xl" />
            <div className="relative bg-gradient-to-r from-primary/10 to-cyan-400/10 backdrop-blur-sm border border-primary/20 rounded-3xl p-8 sm:p-12 text-center">
              <Instagram className="w-16 h-16 text-pink-500 mx-auto mb-6" />
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                تابعنا على انستجرام
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                كن أول من يعرف عن الدورات الجديدة والفرص التعليمية
              </p>
              <a href="https://www.instagram.com/raqeem_jo/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg">
                <Instagram className="w-6 h-6" />
                @raqeem_jo
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/10 py-8 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={raqeemLogo} alt="رقيم" className="w-8 h-8 object-contain" />
              <span className="text-sm font-medium bg-gradient-to-l from-primary to-cyan-400 bg-clip-text text-transparent">
                منصة رقيم التعليمية
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/raqeem_jo/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-pink-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} منصة رقيم التعليمية
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Home;