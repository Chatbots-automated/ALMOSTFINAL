import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="pt-24 pb-20">
      <section className="bg-gradient-to-b from-elida-lavender/30 to-elida-cream py-16 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-playfair text-4xl md:text-5xl text-gray-900 mb-6 leading-tight">
              Privatumo politika
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-elida-gold to-elida-accent mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Kaip mes renkame, naudojame ir saugome jūsų asmens duomenis
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="space-y-10">
              {/* Introduction Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-elida-gold/10 rounded-lg">
                    <Shield className="h-6 w-6 text-elida-gold" />
                  </div>
                  <h2 className="text-2xl font-playfair text-gray-900">Įvadas</h2>
                </div>
                <div className="pl-11">
                  <p className="text-gray-600 mb-4">
                    ÉLIDA (Simona Dilė IĮ) gerbia jūsų privatumą ir įsipareigoja saugoti jūsų asmens duomenis pagal Bendrąjį duomenų apsaugos reglamentą (BDAR) ir kitus taikomus duomenų apsaugos įstatymus.
                  </p>
                  <p className="text-gray-600">
                    Šioje privatumo politikoje paaiškiname, kaip renkame, naudojame ir saugome jūsų asmens duomenis, kai naudojatės mūsų paslaugomis ir apsilankote mūsų svetainėje.
                  </p>
                </div>
              </div>

              {/* Payment Processing Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-elida-gold/10 rounded-lg">
                    <Lock className="h-6 w-6 text-elida-gold" />
                  </div>
                  <h2 className="text-2xl font-playfair text-gray-900">Mokėjimų apdorojimas</h2>
                </div>
                <div className="pl-11">
                  <p className="text-gray-600 mb-4">
                    Elektroninėje parduotuvėje apmokėjimai apdorojami naudojantis MakeCommerce.lt platforma, kurios valdytojas Maksekeskus AS (Niine 11, Talinas 10414, Estija, reg. nr.: 12268475), todėl Jūsų asmeninė informacija, reikalinga mokėjimo įvykdymui ir patvirtinimui, bus perduodama Maksekeskus AS.
                  </p>
                  <p className="text-gray-600">
                    Mokėjimo metu pateikti duomenys (vardas, pavardė, banko sąskaitos numeris, mokėjimo kortelės duomenys) yra tvarkomi tik mokėjimo operacijos vykdymo tikslais ir nėra saugomi mūsų sistemose.
                  </p>
                </div>
              </div>

              {/* Data Collection Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-elida-gold/10 rounded-lg">
                    <Eye className="h-6 w-6 text-elida-gold" />
                  </div>
                  <h2 className="text-2xl font-playfair text-gray-900">Duomenų rinkimas ir naudojimas</h2>
                </div>
                <div className="pl-11">
                  <p className="text-gray-600 mb-4">
                    Mes renkame šiuos asmens duomenis:
                  </p>
                  <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-2">
                    <li>Vardas ir pavardė (rezervacijoms ir paslaugų teikimui)</li>
                    <li>El. pašto adresas (susisiekimui ir patvirtinimams)</li>
                    <li>Telefono numeris (skubiems pranešimams)</li>
                    <li>Rezervacijos data ir laikas (paslaugų teikimui)</li>
                  </ul>
                  <p className="text-gray-600 mb-4">
                    Šiuos duomenis naudojame šiais tikslais:
                  </p>
                  <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-2">
                    <li>Paslaugų teikimui ir administravimui</li>
                    <li>Susisiekimui dėl jūsų rezervacijų</li>
                    <li>Teisinių įsipareigojimų vykdymui</li>
                    <li>Paslaugų tobulinimui</li>
                  </ul>
                  <p className="text-gray-600">
                    Jūsų duomenys saugomi tik tiek laiko, kiek būtina nurodytais tikslais arba kaip reikalauja įstatymai.
                  </p>
                </div>
              </div>

              {/* Your Rights Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-elida-gold/10 rounded-lg">
                    <FileText className="h-6 w-6 text-elida-gold" />
                  </div>
                  <h2 className="text-2xl font-playfair text-gray-900">Jūsų teisės</h2>
                </div>
                <div className="pl-11">
                  <p className="text-gray-600 mb-4">
                    Pagal BDAR, jūs turite šias teises:
                  </p>
                  <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-2">
                    <li>Teisė susipažinti su savo asmens duomenimis</li>
                    <li>Teisė reikalauti ištaisyti netikslius duomenis</li>
                    <li>Teisė reikalauti ištrinti duomenis (teisė būti pamirštam)</li>
                    <li>Teisė apriboti duomenų tvarkymą</li>
                    <li>Teisė nesutikti su duomenų tvarkymu</li>
                    <li>Teisė į duomenų perkeliamumą</li>
                  </ul>
                  <p className="text-gray-600 mb-4">
                    Norėdami pasinaudoti šiomis teisėmis, susisiekite su mumis el. paštu info@elida.lt.
                  </p>
                  <p className="text-gray-600">
                    Jei manote, kad jūsų duomenys tvarkomi netinkamai, turite teisę pateikti skundą Valstybinei duomenų apsaugos inspekcijai.
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