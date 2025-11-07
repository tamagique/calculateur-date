import React, { useState, useMemo } from 'react';
import { ALGERIAN_GREGORIAN_HOLIDAYS, ALGERIAN_HIJRI_HOLIDAYS } from './constants';

// Helper to format date to YYYY-MM-DD for the input element
const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Legend: React.FC = () => (
    <div className="w-full max-w-2xl mt-8 p-4 bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-lg text-sm text-gray-300">
        <h3 className="text-lg font-semibold text-emerald-400 mb-3 text-center">Légende</h3>
        <dl className="grid grid-cols-[max-content,1fr] gap-x-4 gap-y-2 items-center">
            <dt className="font-bold text-right underline decoration-sky-400 decoration-2">Texte souligné</dt>
            <dd>Indique une date de week-end (Vendredi ou Samedi).</dd>
            
            <dt className="font-bold text-right text-fuchsia-400">Texte fuchsia</dt>
            <dd>Indique un jour férié officiel.</dd>

            <dt className="font-bold text-right animate-pulse">✨ Clignotement</dt>
            <dd>Appliqué à toute date de vacances pour la mettre en évidence.</dd>
        </dl>
    </div>
);


const Footer: React.FC = () => (
  <footer className="mt-8 text-center">
    <a 
      href="https://www.facebook.com/TAMagique" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-lg text-gray-400 hover:text-emerald-400 transition-colors duration-300"
    >
      TAMagique
    </a>
  </footer>
);

const App: React.FC = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [daysOffset, setDaysOffset] = useState(28);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    // HTML date input returns YYYY-MM-DD, which is parsed as UTC midnight.
    // To avoid timezone issues, we add the timezone offset.
    const date = new Date(dateValue);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    setStartDate(new Date(date.getTime() + userTimezoneOffset));
  };

  const calculationResult = useMemo(() => {
    if (!startDate) return null;
    
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + daysOffset);

    const isWeekend = newDate.getDay() === 5 || newDate.getDay() === 6; // Friday or Saturday in Algeria

    const gregorianHoliday = ALGERIAN_GREGORIAN_HOLIDAYS.find(
        h => h.month === newDate.getMonth() + 1 && h.day === newDate.getDate()
    );

    const hijriFormatter = new Intl.DateTimeFormat('ar-DZ-u-ca-islamic', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    const hijriDateString = hijriFormatter.format(newDate);

    const hijriDay = parseInt(new Intl.DateTimeFormat('ar-DZ-u-ca-islamic', { day: 'numeric' }).format(newDate), 10);
    const hijriMonth = new Intl.DateTimeFormat('ar-DZ-u-ca-islamic', { month: 'long' }).format(newDate);

    const hijriHoliday = ALGERIAN_HIJRI_HOLIDAYS.find(
        h => h.day === hijriDay && h.month === hijriMonth
    );
    
    return {
        newGregorianDate: newDate,
        newHijriDate: hijriDateString,
        isWeekend,
        gregorianHolidayName: gregorianHoliday?.name || null,
        hijriHolidayName: hijriHoliday?.name || null,
    };
  }, [startDate, daysOffset]);

  const gregorianDisplayDate = calculationResult 
    ? new Intl.DateTimeFormat('fr-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(calculationResult.newGregorianDate)
    : '';

  const getDynamicClasses = (isHoliday: boolean, isWeekend: boolean): string => {
    let classes = "text-3xl font-bold font-mono tracking-wider transition-all duration-300 p-2 rounded-md ";
    if (isHoliday) {
      classes += "text-fuchsia-400 ";
    } else {
      classes += "text-white ";
    }
    if (isWeekend) {
      classes += "underline decoration-sky-400 decoration-2 underline-offset-4 ";
    }
    if (isHoliday || isWeekend) {
      // a fast pulse animation
      classes += "animate-pulse [animation-duration:0.8s]";
    }
    return classes;
  };
  
  const gregorianClasses = getDynamicClasses(!!calculationResult?.gregorianHolidayName, !!calculationResult?.isWeekend);
  const hijriClasses = getDynamicClasses(!!calculationResult?.hijriHolidayName, !!calculationResult?.isWeekend);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-gray-100 flex flex-col items-center justify-center p-4 selection:bg-emerald-500 selection:text-black">
      <main className="w-full max-w-2xl bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl p-6 md:p-8 space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-emerald-400">Calculateur de Dates Algérien</h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          <div className="flex flex-col items-center text-center w-full md:w-auto">
            <label htmlFor="startDate" className="mb-2 text-gray-300">Date de Référence</label>
            <div className="flex items-center gap-2">
              <input
                id="startDate"
                type="date"
                value={formatDateForInput(startDate)}
                onChange={handleDateChange}
                className="bg-gray-700 border-2 border-gray-600 text-white rounded-lg p-2 text-center focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
              <img src="/TA.png" alt="Logo TA" className="h-10 w-10" />
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center w-full md:w-auto">
            <label htmlFor="daysOffset" className="mb-2 text-gray-300">Nombre de Jours (+/-)</label>
            <input
              id="daysOffset"
              type="number"
              value={daysOffset}
              onChange={(e) => setDaysOffset(parseInt(e.target.value, 10) || 0)}
              className="bg-gray-700 border-2 border-gray-600 text-white rounded-lg p-2 w-28 text-center focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {calculationResult && (
          <div className="text-center space-y-6 pt-4 border-t-2 border-gray-700">
            <div>
              <h2 className="text-xl text-emerald-300 mb-2">Nouvelle Date Grégorienne</h2>
              <p className={gregorianClasses}>{gregorianDisplayDate}</p>
              {calculationResult.gregorianHolidayName && (
                <p className="text-fuchsia-400 mt-1 text-lg">{calculationResult.gregorianHolidayName}</p>
              )}
            </div>
            <div>
              <h2 className="text-xl text-emerald-300 mb-2">Date Hégirienne Correspondante</h2>
              <p dir="rtl" className={`${hijriClasses} font-['Cairo']`}>{calculationResult.newHijriDate}</p>
               {calculationResult.hijriHolidayName && (
                <p className="text-fuchsia-400 mt-1 text-lg">{calculationResult.hijriHolidayName}</p>
              )}
            </div>
          </div>
        )}
      </main>

      <Legend />
      <Footer />
    </div>
  );
};

export default App;