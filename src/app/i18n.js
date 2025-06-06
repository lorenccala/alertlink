import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import i18nConfig from '../../next-i18next.config';

export async function getTranslations(locale, namespaces) {
    const i18nInstance = createInstance();

    await i18nInstance
        .use(resourcesToBackend((language, namespace) =>
            import(`../../public/locales/${language}/${namespace}.json`)))
        .init({
            lng: locale,
            fallbackLng: i18nConfig.i18n.defaultLocale,
            supportedLngs: i18nConfig.i18n.locales,
            defaultNS: namespaces[0],
            ns: namespaces,
            preload: i18nConfig.i18n.locales,
        });

    return {
        t: i18nInstance.t.bind(i18nInstance),
        i18n: i18nInstance,
        resources: i18nInstance.services.resourceStore.data
    };
} 