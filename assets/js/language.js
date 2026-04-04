function translate(key, locale) {
    if (typeof translations[locale] === 'undefined') {
        return key;
    }
    return translations[locale][key] || translations['fr'][key];
}













