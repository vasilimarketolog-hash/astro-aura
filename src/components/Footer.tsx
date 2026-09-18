'use client';

import React from 'react';
import { Compass, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
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

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-600 font-medium">
            <a href="#rules" onClick={(e) => { e.preventDefault(); alert('Пользовательское соглашение и оферта: сервис носит развлекательно-информационный характер.'); }} className="hover:text-stone-900 transition-colors">
              Пользовательское соглашение
            </a>
            <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Политика конфиденциальности: персональные данные защищены и не передаются третьим лицам.'); }} className="hover:text-stone-900 transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#unsub" onClick={(e) => { e.preventDefault(); alert('Для управления подпиской перейдите в профиль или напишите в службу заботы: support@astroaura.online'); }} className="hover:text-amber-700 transition-colors">
              Управление подпиской / Отмена
            </a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); alert('Служба поддержки: support@astroaura.online. Время ответа: до 15 минут.'); }} className="hover:text-stone-900 transition-colors">
              Служба заботы
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} AstroAura. Все права защищены. Разработано с использованием эфемерид NASA.</p>
          <div className="flex items-center space-x-2 text-stone-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Безопасный эквайринг и конфиденциальность данных</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
