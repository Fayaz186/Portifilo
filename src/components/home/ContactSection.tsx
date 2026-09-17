import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ProfileBio } from '../../types';
import { saveContactMessage } from '../../services/storageService';
import {
  Mail,
  MapPin,
  Send,
  CheckCircle,
  Phone,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface ContactSectionProps {
  profile: ProfileBio;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg(language === 'fa' ? 'لطفاً تمام فیلدهای الزامی را تکمیل نمایید.' : 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await saveContactMessage({
        senderName: formData.name,
        senderEmail: formData.email,
        subject: formData.subject || 'Portfolio Inquiry',
        message: formData.message
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setErrorMsg(language === 'fa' ? 'در ارسال پیام مشکلی رخ داد. لطفاً دوباره تلاش فرمایید.' : 'Failed to deliver message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="scroll-mt-28 py-12 sm:py-20 bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{language === 'fa' ? 'ارتباط و همکاری' : 'Get In Touch'}</span>
              </div>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {t('contactTitle')}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
                {t('contactSubtitle')}
              </p>
            </div>

            {/* Direct Cards */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3 sm:gap-4 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold uppercase text-slate-400">
                    {language === 'fa' ? 'ایمیل رسمی' : 'Official Email'}
                  </div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors break-all"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3 sm:gap-4 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold uppercase text-slate-400">
                    {language === 'fa' ? 'شماره تماس / تلگرام' : 'Phone / WhatsApp'}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-900 break-words">
                    {profile.phone}
                  </div>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3 sm:gap-4 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold uppercase text-slate-400">
                    {language === 'fa' ? 'محل سکونت و پایگاه' : 'Primary Base'}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-900 break-words">
                    {profile.location[language]}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-4 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span>{language === 'fa' ? 'ارسال مستقیم پیام یا پیشنهاد' : 'Send a Direct Inquiry'}</span>
              </h3>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-900">
                    {language === 'fa' ? 'پیام شما با موفقیت ارسال شد!' : 'Message Successfully Transmitted!'}
                  </h4>
                  <p className="text-sm text-emerald-800 max-w-md mx-auto">
                    {t('formSuccess')}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
                  >
                    {language === 'fa' ? 'ارسال پیام دیگر' : 'Send Another Message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                        {t('formName')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Dr. Jane Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                        {t('formEmail')} *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jane.doe@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                      {t('formSubject')}
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Research Collaboration / Mobile Engineering Project"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                      {t('formMessage')} *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share project parameters, research context, or inquiry..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 text-sm transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>{t('formSending')}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t('formSubmit')}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
