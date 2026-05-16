const i18n = (function(){
  const defaultLang = 'en';
  let translations = {};
  let baseEn = {};
  let reverseMap = {};
  let current = localStorage.getItem('site_lang') || (navigator.language && navigator.language.startsWith('es') ? 'es' : defaultLang);

  async function tryFetchPaths(paths){
    for(const p of paths){
      try{ const res = await fetch(p); if(res && res.ok) return res; }catch(e){ }
    }
    return null;
  }

  async function loadBaseEn(){
    try{
      const paths = ['assets/i18n/en.json','/assets/i18n/en.json','./assets/i18n/en.json'];
      const res = await tryFetchPaths(paths);
      if(!res) return;
      baseEn = await res.json();
      reverseMap = {};
      Object.keys(baseEn).forEach(k => {
        const v = (''+baseEn[k]).trim();
        if(v) reverseMap[v] = k;
      });
    }catch(e){ console.warn('i18n: failed to load base en.json', e); }
  }

  async function load(lang){
    try{
      // ensure base en loaded
      if(Object.keys(baseEn).length === 0) await loadBaseEn();

      const paths = [`assets/i18n/${lang}.json`, `/assets/i18n/${lang}.json`, `./assets/i18n/${lang}.json`];
      const res = await tryFetchPaths(paths);
      if(!res) throw new Error('Failed to load i18n file for '+lang);
      translations = await res.json();
      current = lang;
      localStorage.setItem('site_lang', lang);
      apply();
      document.documentElement.lang = lang;
      const sel = document.getElementById('langSelect'); if(sel) sel.value = lang;
      // update title if page uses data-i18n on title
      const titleEl = document.querySelector('title[data-i18n]');
      if(titleEl){ titleEl.innerHTML = translations[titleEl.getAttribute('data-i18n')] || titleEl.innerHTML; }
    }catch(e){ console.error('i18n load error:', e); }
  }

  function t(key){ return translations[key] !== undefined ? translations[key] : (baseEn[key] !== undefined ? baseEn[key] : key); }

  function apply(){
    let count = 0;
    // First apply explicit attributes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = t(key);
      const attr = el.getAttribute('data-i18n-attr');
      if(attr){ el.setAttribute(attr, value); } else { el.innerHTML = value; }
      count++;
    });

    // Now auto-translate elements by matching their exact English text to keys
    const selectors = 'h1,h2,h3,h4,h5,p,span,a,li,button,small,label';
    document.querySelectorAll(selectors).forEach(el => {
      if(el.hasAttribute('data-i18n')) return;
      const text = el.textContent && el.textContent.trim();
      if(!text) return;
      const key = reverseMap[text];
      if(key && translations[key]){
        el.innerHTML = translations[key];
        el.setAttribute('data-i18n', key);
        count++;
      }
    });

    console.debug(`i18n applied to ${count} elements, lang=${current}`);
  }

  function init(){
    const sel = document.getElementById('langSelect');
    if(sel){ sel.addEventListener('change', (e)=> load(e.target.value)); sel.value = current; }
    // prepare base and load current language
    loadBaseEn().then(()=> load(current));
  }

  return { init, load, t };
})();

window.i18n = i18n;

