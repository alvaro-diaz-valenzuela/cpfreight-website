const i18n = (function(){
  const defaultLang = 'en';
  let translations = {};
  let current = localStorage.getItem('site_lang') || (navigator.language && navigator.language.startsWith('es') ? 'es' : defaultLang);

  async function tryFetchPaths(paths){
    for(const p of paths){
      try{
        const res = await fetch(p);
        if(res && res.ok) return res;
      }catch(e){
        // ignore and try next
      }
    }
    return null;
  }

  async function load(lang){
    try{
      // Try relative path first (works for file:// and relative hosting), then absolute path
      const paths = [`assets/i18n/${lang}.json`, `/assets/i18n/${lang}.json`, `./assets/i18n/${lang}.json`];
      const res = await tryFetchPaths(paths);
      if(!res) throw new Error('Failed to load i18n file for '+lang);
      translations = await res.json();
      current = lang;
      localStorage.setItem('site_lang', lang);
      apply();
      document.documentElement.lang = lang;
      const sel = document.getElementById('langSelect'); if(sel) sel.value = lang;
      // update document title if present
      const titleEl = document.querySelector('title[data-i18n]');
      if(titleEl){ titleEl.innerHTML = t(titleEl.getAttribute('data-i18n')); }
    }catch(e){
      console.error('i18n load error:', e);
    }
  }

  function t(key){
    return translations[key] !== undefined ? translations[key] : key;
  }

  function apply(){
    let count = 0;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = t(key);
      const attr = el.getAttribute('data-i18n-attr');
      if(attr){
        el.setAttribute(attr, value);
      } else {
        // preserve existing child structure if element contains a <span> for active dot etc.
        el.innerHTML = value;
      }
      count++;
    });
    console.debug(`i18n applied to ${count} elements, lang=${current}`);
  }

  function init(){
    // attach selector
    const sel = document.getElementById('langSelect');
    if(sel){
      sel.addEventListener('change', (e)=> load(e.target.value));
      sel.value = current;
    }
    // load translations
    load(current);
  }

  return { init, load, t };
})();

// Expose globally
window.i18n = i18n;
