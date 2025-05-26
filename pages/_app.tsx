/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthContextProvider } from '@/app/context/AuthContext';
import './globals.css';
import type { AppProps } from 'next/app';
import { AppContextProvider } from '@/app/context/AppContext';
import { SessionProvider } from 'next-auth/react';
import { AdminContextProvider } from '@/app/context/AdminContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Capacitor } from '@capacitor/core';
import { AppTrackingTransparency } from 'capacitor-plugin-app-tracking-transparency';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Camera, CameraPermissionType } from '@capacitor/camera';
import NetworkDetector from '@/app/components/NetworkDetector';

const MyApp = ({ Component, pageProps }: AppProps) => {
  // const startOneSignal = () => {
  // // Enable verbose logging for debugging (remove in production)
  // OneSignal.Debug.setLogLevel(6);
  // // Initialize with your OneSignal App ID
  // OneSignal.initialize(process.env.APP_ID_ONESIGNAL!);
  // // Use this method to prompt for push notifications.
  // // We recommend removing this method after testing and instead use In-App Messages to prompt for notification permission.
  // OneSignal.Notifications.requestPermission(false).then((accepted: boolean) => {
  //   console.log("User accepted notifications: " + accepted);
  // });
  // }
  
  
//  useEffect(() => {
//   if (typeof window !== 'undefined' && window.cordova && window.plugins) {
//     import('onesignal-cordova-plugin')
//       .then(({ default: OneSignal }) => {
//         OneSignal.initialize(process.env.NEXT_PUBLIC_APP_ID_ONESIGNAL);
//         OneSignal.Notifications.requestPermission(false).then((accepted) => {
//           console.log("User accepted notifications: " + accepted);
//         });
//       })
//       .catch((error) => {
//         console.error('OneSignal initialization failed:', error);
//       });
//   } else {
//     console.warn('Cordova environment not detected. OneSignal initialization skipped.');
//   }
// }, []);
  const [isScrolling, setIsScrolling] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const requestATT = async () => {
      if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
        const { status } = await AppTrackingTransparency.requestPermission();
        console.log('ATT Status:', status);
      }
    };
  
    requestATT();
  }, []);

  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = () => {
      setIsScrolling(true);
    };

    const handleTouchEnd = () => {
      setIsScrolling(false);
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // Inizializza le variabili CSS per la safe area
    document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
    document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
    document.documentElement.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)');
    document.documentElement.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)');

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  

  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <AdminContextProvider>
        <AuthContextProvider>
          <AppContextProvider>
            <Component {...pageProps} />
            <div className={`h-28 w-full fixed bottom-0 z-50 ${router.pathname.includes("collection") || router.pathname == "/" || router.pathname == "/login" || router.pathname == "/changepassword" || router.pathname == "/teammessage" || router.pathname == "/register" || router.pathname == "/premium" || router.pathname == "/settings" || (router.pathname.includes("profile") && router.pathname != "/savedprofiles") || router.pathname == "/home" || router.pathname == "/assistance" || router.pathname == "/privacypolicy" ? 'hidden' : ''}`}>
              <div className={`absolute inset-0 transition-all duration-[2000ms] ${isScrolling ? 'bg-gradient-to-t from-black/50 to-transparent' : ''
                }`}></div>
              <div
                className={`fixed bottom-[-100px] w-full h-[100px] shadow-[0px_-90px_90px_rgba(0,0,0,0.99)] z-[] pointer-events-none ${router.pathname.includes("collection") ? "hidden" : ""}`}
              ></div>
  <NetworkDetector />
            </div>
          </AppContextProvider>
        </AuthContextProvider>
      </AdminContextProvider>
    </SessionProvider>
  )
};

export default MyApp;
