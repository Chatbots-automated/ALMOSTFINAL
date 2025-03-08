import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CreditCard, RefreshCw, ShieldCheck } from 'lucide-react';

export default function TermsAndConditions() {
  return (
    <div className="pt-24 pb-20">
      <section className="bg-gradient-to-b from-elida-warm to-elida-cream py-16 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-playfair text-4xl md:text-5xl text-gray-900 mb-6 leading-tight">
              Pirkimo taisyklės
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-elida-gold to-elida-accent mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Susipažinkite su mūsų pirkimo sąlygomis ir taisyklėmis
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="space-y-10">
              {/* Payment Methods Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-elida-gold/10 rounded-lg">
                    <CreditCard className="h-6 w-6 text-elida-gold" />
                  </div>
                  <h2 className="text-2xl font-playfair text-gray-900">Mokėjimo būdai ir valiuta</h2>
                </div>
                <div className="pl-11">
                  <p className="text-gray-600 mb-4">
                    Atsiskaityti galima naudojantis Swedbank, SEB, Luminor, Citadele ir Šiaulių bankas elektroninės bankininkystės paslaugomis. Atsiskaitymai galimi euro valiuta. Mokėjimai apdorojami naudojantis MakeCommerce.lt mokėjimų platforma.
                  </p>
                  <p className="text-gray-600">
                    Mokėjimo operacijos atliekamos saugiai, naudojant šiuolaikines duomenų šifravimo technologijas. Jūsų banko duomenys nėra saugomi mūsų sistemose.
                  </p>
                </div>
              </div>

              {/* Refund Policy Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-elida-gold/10 rounded-lg">
                    <RefreshCw className="h-6 w-6 text-elida-gold" />
                  </div>
                  <h2 className="text-2xl font-playfair text-gray-900">Grąžinimo politika</h2>
                </div>
                <div className="pl-11">
                  <p className="text-gray-600 mb-4">
                    Soliariumo paslaugų rezervacijas galima atšaukti ne vėliau kaip 24 valandos iki numatyto vizito laiko. Atšaukus rezervaciją laiku, pinigai grąžinami per 5-7 darbo dienas į tą pačią mokėjimo priemonę, kuria buvo atliktas mokėjimas.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Neatvykus į rezervuotą vizitą arba atšaukus rezervaciją vėliau nei 24 valandos iki numatyto laiko, pinigai nėra grąžinami.
                  </p>
                  <p className="text-gray-600">
                    Išskirtiniais atvejais (liga, force majeure aplinkybės), pateikus atitinkamus įrodymus, sprendimas dėl pinigų grąžinimo priimamas individualiai.
                  </p>
                </div>
              </div>

              {/* Terms of Service Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-elida-gold/10 rounded-lg">
                    <FileText className="h-6 w-6 text-elida-gold" />
                  </div>
                  <h2 className="text-2xl font-playfair text-gray-900">Paslaugų teikimo sąlygos</h2>
                </div>
                <div className="pl-11">
                  <p className="text-gray-600 mb-4">
                    Rezervuojant soliariumo paslaugas, būtina pateikti tikslią kontaktinę informaciją. Klientas yra atsakingas už teisingos informacijos pateikimą.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Rekomenduojame atvykti 5-10 minučių anksčiau prieš rezervuotą laiką. Vėluojant daugiau nei 10 minučių, rezervacija gali būti atšaukta be pinigų grąžinimo.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Soliariumo paslaugos neteikiamos asmenims, jaunesniems nei 18 metų, nebent yra pateiktas raštiškas tėvų ar globėjų sutikimas.
                  </p>
                  <p className="text-gray-600">
                    ÉLIDA pasilieka teisę atsisakyti teikti paslaugas asmenims, kurie yra apsvaigę nuo alkoholio ar kitų medžiagų, taip pat asmenims, kurių sveikatos būklė gali kelti riziką naudojantis soliariumo paslaugomis.
                  </p>
                </div>
              </div>

              {/* Legal Information Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-elida-gold/10 rounded-lg">
                    <ShieldCheck className="h-6 w-6 text-elida-gold" />
                  </div>
                  <h2 className="text-2xl font-playfair text-gray-900">Teisinė informacija</h2>
                </div>
                <div className="pl-11">
                  <p className="text-gray-600 mb-4">
                    Paslaugų teikėjas: Simona Dilė IĮ
                  </p>
                  <p className="text-gray-600 mb-4">
                    Įmonės kodas: 306722261
                  </p>
                  <p className="text-gray-600 mb-4">
                    Adresas: Danutės g. 43-37, LT-36234 Panevėžys
                  </p>
                  <p className="text-gray-600 mb-4">
                    El. paštas: info@elida.lt
                  </p>
                  <p className="text-gray-600">
                    Telefonas: +370 664 46916
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}