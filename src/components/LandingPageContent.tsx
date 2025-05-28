"use client"

import { QRCodeCanvas } from 'qrcode.react';
import { Button } from "@/components/ui/button";

import { motion } from "framer-motion";
import React from 'react';
import Image from 'next/image';
import { MapPin, Smartphone, CheckCircle, ShieldCheck, Users, Send, Search, Edit3, BarChart2 } from 'lucide-react'; // Example icons


// Animation variants (re-using yours)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delayChildren: 0.3, staggerChildren: 0.2 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

interface LandingPageContentProps {
  messages: {
    tagline: string;
    description: string;
    subDescription: string;
    viewReports: string;
    exploreMap: string;
    downloadApp: string;
    scanToDownload: string;
    // New messages for added sections
    howItWorks: string;
    step1Title: string;
    step1Description: string;
    step2Title: string;
    step2Description: string;
    step3Title: string;
    step3Description: string;
    step4Title: string;
    step4Description: string;
    featuresTitle: string;
    feature1Title: string;
    feature1Description: string;
    feature2Title: string;
    feature2Description: string;
    feature3Title: string;
    feature3Description: string;
    feature4Title: string;
    feature4Description: string;
  };
  locale: string;
}

export function LandingPageContent({ messages: propMessages, locale }: LandingPageContentProps) {
  const messages = propMessages;

  const howItWorksSteps = [
    { icon: <Send className="w-8 h-8 text-blue-600" />, title: messages.step1Title, description: messages.step1Description },
    { icon: <ShieldCheck className="w-8 h-8 text-blue-600" />, title: messages.step2Title, description: messages.step2Description },
    { icon: <Search className="w-8 h-8 text-blue-600" />, title: messages.step3Title, description: messages.step3Description },
    { icon: <Users className="w-8 h-8 text-blue-600" />, title: messages.step4Title, description: messages.step4Description },
  ];

  const features = [
    { icon: <Smartphone className="w-8 h-8 text-teal-500" />, title: messages.feature1Title, description: messages.feature1Description },
    { icon: <MapPin className="w-8 h-8 text-teal-500" />, title: messages.feature2Title, description: messages.feature2Description },
    { icon: <CheckCircle className="w-8 h-8 text-teal-500" />, title: messages.feature3Title, description: messages.feature3Description },
    { icon: <BarChart2 className="w-8 h-8 text-teal-500" />, title: messages.feature4Title, description: messages.feature4Description },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <motion.section
        className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-700 dark:via-blue-800 dark:to-indigo-900 text-white overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            variants={itemVariants}
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 mb-2">
                <motion.div
                  className="relative w-14 h-14 md:w-16 md:h-16 bg-white/95 rounded-xl shadow-lg flex items-center justify-center"
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {<Image
                    src="/roaport-logo.svg"
                    alt="ROAPORT Logo"
                    width={64}
                    height={64}
                    className="w-full h-full"
                    unoptimized
                    priority
                  /> }
                </motion.div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Roaport
                </h1>
              </div>

              <motion.h2
                className="text-xl md:text-2xl lg:text-3xl text-blue-100 dark:text-blue-200 font-medium"
                variants={itemVariants}
              >
                {messages.tagline}
              </motion.h2>

              <motion.div
                className="text-base md:text-lg text-blue-100 dark:text-blue-200 space-y-4"
                variants={itemVariants}
              >
                <p>{messages.description}</p>
                <p>{messages.subDescription}</p>
              </motion.div>

              <motion.div
                className="mt-6 flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
              >
                <Button
                  size="lg"
                  className="bg-white hover:bg-slate-100 text-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all py-2.5 px-5 text-base font-semibold w-full sm:w-auto"
                  asChild
                >
                  <a href={`/${locale}/reports`}>{messages.viewReports}</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-lg border-2 border-blue-300 hover:bg-blue-600/20 hover:border-blue-200 text-blue-800 hover:text-white transition-all py-2.5 px-5 text-base font-semibold w-full sm:w-auto"
                  asChild
                >
                  <a href={`/${locale}/map`}>{messages.exploreMap}</a>
                </Button>
              </motion.div>
            </div>

            <motion.div
              className="w-full max-w-lg mx-auto lg:max-w-none lg:w-full justify-self-center lg:justify-self-end"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="relative aspect-[5/4] w-full"
              >
                <Image
                  src="/city-graphic.svg"
                  alt="City illustration with highlighted road issues"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-2xl object-contain w-full h-full"
                  priority
                  unoptimized
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12 lg:mb-16 text-slate-800 dark:text-slate-100"
            variants={itemVariants}
          >
            {messages.howItWorks}
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            variants={containerVariants}
          >
            {howItWorksSteps.map((step, index) => (
              <motion.div 
                key={index} 
                className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                variants={itemVariants}
              >
                <div className="mb-4 p-3 bg-blue-100/80 dark:bg-blue-900/50 rounded-full">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12 lg:mb-16 text-slate-800 dark:text-slate-100"
            variants={itemVariants}
          >
            {messages.featuresTitle}
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="flex items-start p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                variants={itemVariants}
              >
                <div className="mr-4 flex-shrink-0 p-2.5 bg-teal-100 dark:bg-teal-900/50 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-white dark:bg-slate-800 p-6 md:p-8 lg:p-12 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-slate-800 dark:text-slate-100">
              {messages.downloadApp}
            </h3>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-16">
              {/* Android QR */}
              <motion.div
                className="flex flex-col items-center text-center"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full mb-3 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                    <path d="M5 12V6.5a2.5 2.5 0 0 1 5 0V12"></path><path d="M14 12V6.5a2.5 2.5 0 0 1 5 0V12"></path><path d="M12 8v13"></path><path d="M5 16v0a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v0"></path>
                  </svg>
                </div>
                <p className="mb-3 text-base font-medium text-slate-700 dark:text-slate-300">Android App</p>
                <motion.div 
                  className="bg-white p-3 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <QRCodeCanvas 
                    value="https://play.google.com/store/apps/details?id=com.roaport.app" 
                    size={140}
                    fgColor="#1E293B"
                    bgColor="#FFFFFF"
                    includeMargin={true}
                    level="M"
                  />
                </motion.div>
              </motion.div>
              
              {/* iOS QR */}
              <motion.div
                className="flex flex-col items-center text-center"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-sky-100 dark:bg-sky-900/50 rounded-full mb-3 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-600 dark:text-sky-400">
                     <path d="M12 2c.93 0 1.51.65 1.59 1.5 0 0 .15 1.5-.42 2-1.17 1-2.34 0-3.75 1.11-.83.62-.92 1.94-.92 1.94C7.43 4.71 10.5 2 12 2Z"></path><path d="M12 7c2.21 0 4 1.79 4 4v10c0 .55-.45 1-1 1H9c-.55 0-1-.45-1-1V11c0-2.21 1.79-4 4-4Z"></path>
                  </svg>
                </div>
                <p className="mb-3 text-base font-medium text-slate-700 dark:text-slate-300">iOS App</p>
                <motion.div 
                  className="bg-white p-3 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                   <QRCodeCanvas 
                    value="https://apps.apple.com/app/roaport/id123456789" 
                    size={140}
                    fgColor="#1E293B"
                    bgColor="#FFFFFF"
                    includeMargin={true}
                    level="M"
                  />
                </motion.div>
              </motion.div>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-8">
              {messages.scanToDownload}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-16 pb-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/roaport-logo.svg"
                  alt="ROAPORT Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                  unoptimized
                  loader={({ src }) => src}
                />
                <span className="font-semibold text-lg text-blue-600 dark:text-blue-400">ROAPORT</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md text-sm">
                Making our roads safer by enabling citizens to report infrastructure issues quickly and efficiently.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-sm uppercase tracking-wider mb-4 text-slate-700 dark:text-slate-300">Quick Links</h3>
              <ul className="space-y-2.5">
                <li><a href={`/${locale}/reports`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Reports</a></li>
                <li><a href={`/${locale}/map`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Map</a></li>
                <li><a href={`/${locale}/scoreboard`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Scoreboard</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-sm uppercase tracking-wider mb-4 text-slate-700 dark:text-slate-300">Contact</h3>
              <ul className="space-y-2.5">
                <li>
                  <a href="mailto:support@roaport.com" className="text-sm flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Edit3 size={14} />
                    <span>support@roaport.com</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} ROAPORT. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}