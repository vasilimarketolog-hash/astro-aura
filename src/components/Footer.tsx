'use client';

import React, { useState } from 'react';
import { Compass, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { Locale } from '@/types/astro';
import { getTranslation } from '@/lib/translations';

interface FooterProps {
  locale?: Locale;
}

type ModalType = 'terms' | 'privacy' | 'subscription' | 'support' | null;

export const Footer: React.FC<FooterProps> = ({ locale = 'ru' }) => {
  const t = getTranslation(locale);
  const isEn = locale === 'en';
  const isEs = locale === 'es';
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <footer className="border-t border-stone-200/80 bg-[#FAF8F5] text-stone-500 py-12 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-200/80">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-base font-extrabold text-stone-900 tracking-tight">AstroAura</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-stone-600 font-medium">
            <button
              type="button"
              onClick={() => setActiveModal('terms')}
              className="px-3 py-2.5 rounded-lg hover:text-stone-900 hover:bg-stone-100/60 transition-colors min-h-[44px] flex items-center cursor-pointer"
            >
              {t.footerTerms}
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              className="px-3 py-2.5 rounded-lg hover:text-stone-900 hover:bg-stone-100/60 transition-colors min-h-[44px] flex items-center cursor-pointer"
            >
              {t.footerPrivacy}
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('subscription')}
              className="px-3 py-2.5 rounded-lg hover:text-amber-800 hover:bg-amber-50/60 transition-colors min-h-[44px] flex items-center cursor-pointer text-amber-700 font-semibold"
            >
              {t.footerSubscription}
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('support')}
              className="px-3 py-2.5 rounded-lg hover:text-stone-900 hover:bg-stone-100/60 transition-colors min-h-[44px] flex items-center cursor-pointer"
            >
              {t.footerSupport}
            </button>
          </div>
        </div>

        {/* Legal entertainment disclaimer */}
        <div className="pt-6 pb-4 border-b border-stone-200/60">
          <div className="flex items-start space-x-2 text-[11px] text-stone-500 leading-relaxed max-w-4xl mx-auto text-center justify-center">
            <AlertCircle className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5 hidden sm:inline" />
            <p>{t.footerDisclaimer}</p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} AstroAura. {t.footerCopyright}</p>
          <div className="flex items-center space-x-2 text-stone-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t.footerSecurity}</span>
          </div>
        </div>
      </div>

      {/* Accessible Legal Info Modal */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[85vh] overflow-y-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">
                {activeModal === 'terms' && (isEs ? 'Términos de Servicio y Oferta Pública' : isEn ? 'Terms of Service & Public Offer' : 'Пользовательское соглашение и оферта')}
                {activeModal === 'privacy' && (isEs ? 'Política de Privacidad' : isEn ? 'Privacy Policy' : 'Политика конфиденциальности')}
                {activeModal === 'subscription' && (isEs ? 'Gestión de Suscripción / Cancelación' : isEn ? 'Manage Subscription / Cancellation' : 'Управление подпиской и отмена')}
                {activeModal === 'support' && (isEs ? 'Atención al Cliente y Soporte' : isEn ? 'Customer Care & Support' : 'Служба заботы и поддержки')}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-stone-600 leading-relaxed space-y-3">
              {activeModal === 'terms' && (
                <>
                  <p>
                    {isEs
                      ? 'Al utilizar el servicio AstroAura, aceptas estos Términos de Servicio. AstroAura proporciona cálculos astronómicos algorítmicos, cartas de Diseño Humano y consultas astrológicas con Inteligencia Artificial.'
                      : isEn
                      ? 'By using the AstroAura service, you agree to these Terms of Service. AstroAura provides algorithmic astrological calculations, Human Design blueprints, and AI astrological consultations.'
                      : 'Используя сервис AstroAura, вы соглашаетесь с условиями настоящего Пользовательского соглашения. Сервис предоставляет алгоритмические астрономические расчеты, карты Дизайна Человека и консультации AI-астролога.'}
                  </p>
                  <p>
                    {isEs
                      ? 'El servicio tiene fines exclusivos de entretenimiento, autoconocimiento y reflexión personal. Los informes astrológicos no sustituyen el asesoramiento médico, financiero o legal profesional.'
                      : isEn
                      ? 'The service is intended exclusively for entertainment and self-reflection purposes. Astrological reports are not financial, medical, or legal advice.'
                      : 'Сервис носит исключительно развлекательно-информационный характер и не заменяет квалифицированную врачебную, финансовую или юридическую помощь.'}
                  </p>
                </>
              )}

              {activeModal === 'privacy' && (
                <>
                  <p>
                    {isEs
                      ? 'Respetamos tu privacidad. Todos los datos de nacimiento introducidos (nombre, fecha, hora, ciudad) se utilizan únicamente para calcular efemérides astronómicas y se transmiten de forma segura con cifrado SSL de 256 bits.'
                      : isEn
                      ? 'We respect your privacy. All birth details entered (name, date, time, location) are used solely to compute astronomical coordinates and are transmitted securely via 256-bit SSL encryption.'
                      : 'Мы ценим вашу конфиденциальность. Персональные данные рождения (имя, дата, время, город) используются исключительно для расчета астрономических эфемерид и передаются по защищенному протоколу 256-bit SSL.'}
                  </p>
                  <p>
                    {isEs
                      ? 'Nunca vendemos ni compartimos tus datos personales con terceros. Puedes solicitar la eliminación definitiva de tus datos en cualquier momento escribiendo a support@astroaura.pro.'
                      : isEn
                      ? 'We never sell or disclose your personal data to third parties. You may request data erasure at any time by contacting support@astroaura.pro.'
                      : 'Мы никогда не передаем и не продаем ваши личные данные третьим лицам. Вы можете запросить удаление данных в любой момент, написав на support@astroaura.pro.'}
                  </p>
                </>
              )}

              {activeModal === 'subscription' && (
                <>
                  <p className="font-semibold text-stone-800">
                    {isEs
                      ? 'Puedes cancelar tu suscripción en cualquier momento sin preguntas ni complicaciones.'
                      : isEn
                      ? 'You can cancel your subscription at any time without questions asked.'
                      : 'Вы можете отменить подписку в любой момент в 1 клик без скрытых комиссий.'}
                  </p>
                  <p>
                    {isEs
                      ? 'Para gestionar o cancelar tu plan, simplemente envía tu correo registrado a support@astroaura.pro o responde al correo de confirmación de tu compra. Las cancelaciones se procesan de inmediato.'
                      : isEn
                      ? 'To cancel or manage your plan, simply send your registration email to support@astroaura.pro or reply to your confirmation receipt email. Cancellations are processed immediately.'
                      : 'Для управления тарифом или мгновенной отмены подписки отправьте ваш Email на support@astroaura.pro или воспользуйтесь ссылкой отмены из приветственного письма. Запрос обрабатывается моментально.'}
                  </p>
                </>
              )}

              {activeModal === 'support' && (
                <>
                  <p>
                    {isEs
                      ? 'Nuestro equipo de atención al cliente está disponible 24/7 para ayudarte con cálculos, descarga del informe en PDF o dudas sobre pagos.'
                      : isEn
                      ? 'Our customer support team is available 24/7 to assist with calculations, PDF reports, or billing questions.'
                      : 'Наша служба заботы на связи 24/7 и готова помочь с вопросами по расчетам, скачиванию PDF или тарифам.'}
                  </p>
                  <p className="pt-2">
                    <strong className="text-stone-900 block mb-1">
                      {isEs ? 'Contacto Directo:' : isEn ? 'Direct Contact:' : 'Прямой контакт:'}
                    </strong>
                    <a
                      href="mailto:support@astroaura.pro"
                      className="text-amber-700 hover:underline font-bold text-sm"
                    >
                      support@astroaura.pro
                    </a>
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {isEs ? 'Tiempo promedio de respuesta: menos de 15 minutos.' : isEn ? 'Average response time: under 15 minutes.' : 'Среднее время ответа: до 15 минут.'}
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="min-h-[44px] min-w-[44px] px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center"
              >
                {isEs ? 'Entendido' : isEn ? 'Close' : 'Понятно'}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
