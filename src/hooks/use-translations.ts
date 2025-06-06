'use client';

import { useCallback } from 'react';
import { useParams } from 'next/navigation';

type Locale = 'en' | 'al';
type Namespace = 'common';

type TranslationKey =
    | 'greeting'
    | 'welcome'
    | 'loginTitle'
    | 'loginDescription'
    | 'selectRole'
    | 'enterOtp'
    | 'login'
    | 'loggingIn'
    | 'loginSuccess'
    | 'loginFailed'
    | 'invalidOtp'
    | 'welcomeRole'
    | 'demoCredentials'
    | 'roleAdmin'
    | 'roleResponder'
    | 'roleObserver'
    | `role${'Admin' | 'Responder' | 'Observer'}`;

type Translations = {
    [key in Locale]: {
        [key in Namespace]: {
            [key in TranslationKey]: string;
        };
    };
};

const translations: Translations = {
    en: {
        common: {
            greeting: 'Hello',
            welcome: 'Welcome to Alertlink!',
            loginTitle: 'Welcome to AlertLink',
            loginDescription: 'Enter your credentials to access the system',
            selectRole: 'Select your role',
            enterOtp: 'Enter OTP',
            login: 'Login',
            loggingIn: 'Logging in...',
            loginSuccess: 'Login Successful',
            loginFailed: 'Login Failed',
            invalidOtp: 'Invalid OTP. Please try again.',
            welcomeRole: 'Welcome! You are logged in as {{role}}.',
            demoCredentials: 'Demo: Use OTP 123456',
            roleAdmin: 'Administrator',
            roleResponder: 'Responder',
            roleObserver: 'Observer'
        }
    },
    al: {
        common: {
            greeting: 'Përshëndetje',
            welcome: 'Mirësevini në Alertlink!',
            loginTitle: 'Mirësevini në AlertLink',
            loginDescription: 'Shkruani kredencialet tuaja për të hyrë në sistem',
            selectRole: 'Zgjidhni rolin tuaj',
            enterOtp: 'Shkruani OTP',
            login: 'Hyni',
            loggingIn: 'Duke u loguar...',
            loginSuccess: 'Hyrja u krye me sukses',
            loginFailed: 'Hyrja dështoi',
            invalidOtp: 'OTP e pavlefshme. Ju lutemi provoni përsëri.',
            welcomeRole: 'Mirë se vini! Jeni loguar si {{role}}.',
            demoCredentials: 'Demo: Përdorni OTP 123456',
            roleAdmin: 'Administrator',
            roleResponder: 'Përgjigjës',
            roleObserver: 'Vëzhgues'
        }
    }
};

export function useTranslations(namespace: Namespace = 'common') {
    const params = useParams();
    const locale = (params?.locale as Locale) || 'al';

    const t = useCallback((key: TranslationKey, options?: Record<string, string>) => {
        let translation = translations[locale]?.[namespace]?.[key] || key;

        if (options) {
            Object.entries(options).forEach(([key, value]) => {
                translation = translation.replace(`{{${key}}}`, value);
            });
        }

        return translation;
    }, [locale, namespace]);

    return { t };
} 