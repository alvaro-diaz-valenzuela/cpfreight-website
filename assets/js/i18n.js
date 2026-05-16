const i18n = (function(){
  const defaultLang = 'en';
  let translations = {};
  let current = localStorage.getItem('site_lang') || (navigator.language && navigator.language.startsWith('es') ? 'es' : defaultLang);

  async function load(lang){
    try{
      const res = await fetch(`/assets/i18n/${lang}.json`);
      if(!res.ok) throw new Error('Failed to load '+lang);
      translations = await res.json();
      current = lang;
      localStorage.setItem('site_lang', lang);
      apply();
      document.documentElement.lang = lang;
      const sel = document.getElementById('langSelect'); if(sel) sel.value = lang;
    }catch(e){
      console.error(e);
    }
  }

  function t(key){
    return translations[key] !== undefined ? translations[key] : key;
  }

  function apply(){
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = t(key);
      // Allow setting attributes via data-i18n-attr (e.g., placeholder)
      const attr = el.getAttribute('data-i18n-attr');
      if(attr){
        el.setAttribute(attr, value);
      } else {
        el.innerHTML = value;
      }
    });
  }

  function init(){
    // attach selector
    const sel = document.getElementById('langSelect');
    if(sel){
      sel.addEventListener('change', (e)=> load(e.target.value));
      // ensure current value
      sel.value = current;
    }
    load(current);
  }

  return { init, load, t };
})();

// Expose globally
window.i18n = i18n;
