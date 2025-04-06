"use client"

import { QRCodeCanvas } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import React from 'react';
import Image from 'next/image';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
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
  };
  locale: string;
}

export function LandingPageContent({ messages, locale }: LandingPageContentProps) {
  return (
    <>
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        suppressHydrationWarning
      >
        <motion.div 
          className="flex flex-col gap-6 max-w-xl"
          variants={itemVariants}
          suppressHydrationWarning
        >
          <div className="flex items-center gap-4 mb-2" suppressHydrationWarning>
            <motion.div 
              className="relative w-16 h-16 md:w-20 md:h-20"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              suppressHydrationWarning
            >
              <Image
                src="/roaport-logo.svg"
                alt="ROAPORT Logo"
                width={80}
                height={80}
                className="object-contain w-full h-full"
                unoptimized
                loader={({ src }) => {
                  return src;
                }}
              />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              ROAPORT
            </h1>
          </div>
          
          <motion.h2 
            className="text-xl md:text-2xl text-muted-foreground mt-2 font-medium"
            variants={itemVariants}
            suppressHydrationWarning
          >
            {messages.tagline}
          </motion.h2>
          
          <motion.div 
            className="text-lg text-muted-foreground"
            variants={itemVariants}
            suppressHydrationWarning
          >
            <p className="mb-4">
              {messages.description}
            </p>
            <p>
              {messages.subDescription}
            </p>
          </motion.div>
          
          <motion.div 
            className="mt-8 flex flex-col sm:flex-row gap-4"
            variants={itemVariants}
            suppressHydrationWarning
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-md hover:shadow-lg transition-all py-6"
              asChild
            >
              <a href={`/${locale}/reports`}>
                {messages.viewReports}
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="rounded-full border-2 hover:bg-secondary/50 transition-all py-6"
              asChild
            >
              <a href={`/${locale}/map`}>
                {messages.exploreMap}
              </a>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="w-full max-w-3xl mx-auto"
          variants={itemVariants}
          suppressHydrationWarning
        >
          <motion.div 
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            suppressHydrationWarning
          >
            <Card className="overflow-hidden backdrop-blur-sm bg-card/90 dark:bg-card/60 shadow-xl border border-border/40 rounded-2xl">
              <div className="p-6 md:p-8" suppressHydrationWarning>
                <h3 className="text-2xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                  {messages.downloadApp}
                </h3>
                
                <div className="flex flex-col sm:flex-row justify-center gap-10 mx-auto" suppressHydrationWarning>
                  <motion.div
                    className="flex flex-col items-center bg-gradient-to-b from-green-50/50 to-transparent dark:from-green-900/10 p-4 rounded-xl"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    suppressHydrationWarning
                  >
                    <div className="flex items-center justify-center w-11 h-11 bg-green-100 dark:bg-green-900/30 rounded-full mb-2 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                        <path d="M5 12V6.5a2.5 2.5 0 0 1 5 0V12"></path>
                        <path d="M14 12V6.5a2.5 2.5 0 0 1 5 0V12"></path>
                        <path d="M12 8v13"></path>
                        <path d="M5 16v0a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v0"></path>
                      </svg>
                    </div>
                    <p className="mb-3 text-sm font-medium text-green-700 dark:text-green-400">Android</p>
                    <div className="w-auto inline-block">
                      <motion.div 
                        className="bg-white p-2.5 rounded-lg shadow-md border border-green-100 dark:border-green-900/20 hover:shadow-lg transition-all"
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        suppressHydrationWarning
                      >
                        <QRCodeCanvas 
                          value="https://play.google.com/store/apps/details?id=com.roaport.app" 
                          size={180}
                          fgColor="#333333"
                          bgColor="#ffffff"
                          includeMargin={true}
                          level="M"
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="flex flex-col items-center bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 p-4 rounded-xl"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    suppressHydrationWarning
                  >
                    <div className="flex items-center justify-center w-11 h-11 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-2 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                        <path d="M12 2c.93 0 1.51.65 1.59 1.5 0 0 .15 1.5-.42 2-1.17 1-2.34 0-3.75 1.11-.83.62-.92 1.94-.92 1.94C7.43 4.71 10.5 2 12 2Z"></path>
                        <path d="M12 7c2.21 0 4 1.79 4 4v10c0 .55-.45 1-1 1H9c-.55 0-1-.45-1-1V11c0-2.21 1.79-4 4-4Z"></path>
                      </svg>
                    </div>
                    <p className="mb-3 text-sm font-medium text-blue-700 dark:text-blue-400">iOS</p>
                    <div className="w-auto inline-block">
                      <motion.div 
                        className="bg-white p-2.5 rounded-lg shadow-md border border-blue-100 dark:border-blue-900/20 hover:shadow-lg transition-all"
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        suppressHydrationWarning
                      >
                        <QRCodeCanvas 
                          value="https://apps.apple.com/app/roaport/id123456789" 
                          size={180}
                          fgColor="#333333"
                          bgColor="#ffffff"
                          includeMargin={true}
                          level="M"
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
                
                <p className="text-base text-muted-foreground text-center mt-10">
                  {messages.scanToDownload}
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Modern Footer */}
      <footer className="mt-auto pt-16 pb-8 border-t border-border/30 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/roaport-logo.svg"
                  alt="ROAPORT Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  unoptimized
                  loader={({ src }) => {
                    return src;
                  }}
                />
                <span className="font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">ROAPORT</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Making our roads safer by enabling citizens to report infrastructure issues quickly and efficiently.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 rounded-full bg-secondary/20 text-muted-foreground hover:text-primary hover:bg-secondary/30 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-full bg-secondary/20 text-muted-foreground hover:text-primary hover:bg-secondary/30 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-full bg-secondary/20 text-muted-foreground hover:text-primary hover:bg-secondary/30 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-base mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href={`/${locale}/reports`} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    Reports
                  </a>
                </li>
                <li>
                  <a href={`/${locale}/map`} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    Map
                  </a>
                </li>
                <li>
                  <a href={`/${locale}/scoreboard`} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    Scoreboard
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-base mb-4">Contact</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  <span>support@roaport.com</span>
                </li>
                <li className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>123 Road Safety Street, City</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ROAPORT. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}