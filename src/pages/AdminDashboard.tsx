import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Trash2, Search, Award, LogOut, Home, 
  FileText, Loader2, AlertCircle, RefreshCw,
  Calendar, Hash, User, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import raqeemLogo from '@/assets/raqeem-logo.png';

interface Certificate {
  id: string;
  participant_name: string;
  course_title: string;
  certificate_id: string;
  issued_date: string;
  pdf_url: string | null;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Certificate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for adding certificate
  const [newCertificate, setNewCertificate] = useState({
    participant_name: '',
    course_title: '',
    certificate_id: '',
  });

  useEffect(() => {
    const hasAccess = sessionStorage.getItem('adminAccess');
    if (!hasAccess) {
      navigate('/admin');
      return;
    }
    fetchCertificates();
  }, [navigate]);

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل الشهادات',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateCertificateId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'RQM-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleAddCertificate = async () => {
    if (!newCertificate.participant_name || !newCertificate.course_title) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const certificateId = newCertificate.certificate_id || generateCertificateId();
      
      const { error } = await supabase.from('certificates').insert({
        participant_name: newCertificate.participant_name,
        course_title: newCertificate.course_title,
        certificate_id: certificateId,
        qr_verification_url: `/verify?id=${certificateId}`,
      });

      if (error) throw error;

      toast({
        title: 'تم بنجاح',
        description: 'تمت إضافة الشهادة بنجاح',
      });

      setIsAddDialogOpen(false);
      setNewCertificate({ participant_name: '', course_title: '', certificate_id: '' });
      fetchCertificates();
    } catch (error) {
      console.error('Error adding certificate:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في إضافة الشهادة',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCertificate = async () => {
    if (!deleteTarget) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', deleteTarget.id);

      if (error) throw error;

      toast({
        title: 'تم الحذف',
        description: 'تم حذف الشهادة بنجاح',
      });

      setDeleteTarget(null);
      fetchCertificates();
    } catch (error) {
      console.error('Error deleting certificate:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في حذف الشهادة',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAccess');
    navigate('/admin');
  };

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.participant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.course_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.certificate_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={raqeemLogo} alt="رقيم" className="w-10 h-10 object-contain" />
              <div>
                <h1 className="text-lg font-bold text-foreground">لوحة التحكم</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">إدارة الشهادات</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/certgen')}
                className="text-muted-foreground hover:text-foreground"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline mr-1">إنشاء شهادات</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline mr-1">الرئيسية</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline mr-1">خروج</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card className="glass-panel">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-raqeem flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{certificates.length}</p>
                <p className="text-sm text-muted-foreground">إجمالي الشهادات</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(certificates.map((c) => c.course_title)).size}
                </p>
                <p className="text-sm text-muted-foreground">الدورات</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <User className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(certificates.map((c) => c.participant_name)).size}
                </p>
                <p className="text-sm text-muted-foreground">المشاركون</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن شهادة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchCertificates}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} className="raqeem-button">
              <Plus className="w-4 h-4 ml-1" />
              إضافة شهادة
            </Button>
          </div>
        </div>

        {/* Certificates List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">لا توجد شهادات</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredCertificates.map((cert) => (
              <Card key={cert.id} className="glass-panel overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center">
                    <div className="w-16 sm:w-20 bg-gradient-raqeem flex items-center justify-center py-4">
                      <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="flex-1 p-3 sm:p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-foreground truncate">{cert.participant_name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{cert.course_title}</p>
                          <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              <span dir="ltr">{cert.certificate_id}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(cert.issued_date)}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10 shrink-0"
                          onClick={() => setDeleteTarget(cert)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Add Certificate Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة شهادة جديدة</DialogTitle>
            <DialogDescription>أدخل بيانات الشهادة الجديدة</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="participant_name">اسم المشارك *</Label>
              <Input
                id="participant_name"
                value={newCertificate.participant_name}
                onChange={(e) =>
                  setNewCertificate({ ...newCertificate, participant_name: e.target.value })
                }
                placeholder="أدخل اسم المشارك"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course_title">عنوان الدورة *</Label>
              <Input
                id="course_title"
                value={newCertificate.course_title}
                onChange={(e) =>
                  setNewCertificate({ ...newCertificate, course_title: e.target.value })
                }
                placeholder="أدخل عنوان الدورة"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certificate_id">رقم الشهادة (اختياري)</Label>
              <Input
                id="certificate_id"
                value={newCertificate.certificate_id}
                onChange={(e) =>
                  setNewCertificate({ ...newCertificate, certificate_id: e.target.value })
                }
                placeholder="سيتم إنشاء رقم تلقائي إذا تركته فارغاً"
                dir="ltr"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddCertificate} disabled={isSubmitting} className="raqeem-button">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin ml-1" /> : <Plus className="w-4 h-4 ml-1" />}
              إضافة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف شهادة "{deleteTarget?.participant_name}"؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCertificate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin ml-1" /> : <Trash2 className="w-4 h-4 ml-1" />}
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
