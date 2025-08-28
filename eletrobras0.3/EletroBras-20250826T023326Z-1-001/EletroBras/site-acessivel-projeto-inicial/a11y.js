// a11y.js — versão robusta
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    try {
      const prefsKey = 'a11y_prefs_v1';
      const defaultPrefs = { scale:1, highContrast:false, darkMode:false, reduceMotion:false, dyslexicFont:false, highlightLinks:false, roomyText:false };

      function loadPrefs(){
        try { const raw = localStorage.getItem(prefsKey); return raw ? Object.assign({}, defaultPrefs, JSON.parse(raw)) : Object.assign({}, defaultPrefs); }
        catch(e){ console.warn('a11y: loadPrefs failed', e); return Object.assign({}, defaultPrefs); }
      }
      function savePrefs(p){ try { localStorage.setItem(prefsKey, JSON.stringify(p)); } catch(e){ console.warn('a11y: savePrefs failed', e); } }

      function applyPrefs(p){
        const root = document.documentElement;
        root.style.setProperty('--a11y-scale', p.scale);
        root.classList.toggle('a11y-contrast', !!p.highContrast);
        root.classList.toggle('dark', !!p.darkMode);
        root.classList.toggle('a11y-reduce-motion', !!p.reduceMotion);
        root.classList.toggle('a11y-dyslexic-font', !!p.dyslexicFont);
        root.classList.toggle('a11y-highlight-links', !!p.highlightLinks);
        root.classList.toggle('a11y-roomy-text', !!p.roomyText);
      }

      let prefs = loadPrefs();
      applyPrefs(prefs);

      // cria botão/painel se não existirem
      function createIfMissing(){
        let btn = document.getElementById('a11y-toggle');
        if(!btn){
          btn = document.createElement('button');
          btn.id = 'a11y-toggle';
          btn.type = 'button';
          btn.title = 'Acessibilidade (Ctrl+Alt+A)';
          btn.setAttribute('aria-expanded','false');
          btn.innerHTML = '♿';
          btn.style.cssText = 'position:fixed;bottom:20px;right:20px;width:50px;height:50px;border-radius:50%;background:#4f46e5;color:#fff;border:none;z-index:10000;cursor:pointer;font-size:20px';
          document.body.appendChild(btn);
        }

        let panel = document.getElementById('a11y-panel');
        if(!panel){
          panel = document.createElement('div');
          panel.id = 'a11y-panel';
          panel.setAttribute('role','dialog');
          panel.setAttribute('aria-hidden','true');
          panel.style.cssText = 'position:fixed;bottom:80px;right:20px;width:320px;max-width:90%;background:#fff;padding:12px;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.2);z-index:10000;display:none;';
          panel.innerHTML = `
            <h3 style="margin-top:0">Acessibilidade</h3>
            <label style="display:block;margin-bottom:6px">Tamanho do texto: <span id="a11y-scale-label">${Math.round(prefs.scale*100)}%</span></label>
            <input id="a11y-scale" type="range" min="0.9" max="1.6" step="0.05" value="${prefs.scale}">
            <hr style="margin:8px 0">
            <label><input type="checkbox" id="a11y-contrast"> Alto contraste</label><br>
            <label><input type="checkbox" id="a11y-dark"> Tema escuro</label><br>
            <label><input type="checkbox" id="a11y-motion"> Pausar animações</label><br>
            <label><input type="checkbox" id="a11y-dyslexic"> Fonte amigável à dislexia</label><br>
            <label><input type="checkbox" id="a11y-links"> Sublinhar/realçar links</label><br>
            <label><input type="checkbox" id="a11y-roomy"> Mais espaçamento de texto</label><br>
            <button id="a11y-reset" style="margin-top:8px;width:100%">Resetar</button>
          `;
          document.body.appendChild(panel);
        }
        return { btn, panel };
      }

      const { btn, panel } = createIfMissing();

      // evita dupla inicialização
      if (btn.dataset && btn.dataset.a11yInit) return;
      if (btn.dataset) btn.dataset.a11yInit = '1';

      // referências
      const scaleInput = document.getElementById('a11y-scale');
      const scaleLabel = document.getElementById('a11y-scale-label');
      const mapIds = { contrast:'a11y-contrast', dark:'a11y-dark', motion:'a11y-motion', dyslexic:'a11y-dyslexic', links:'a11y-links', roomy:'a11y-roomy' };
      const inputs = {};
      Object.keys(mapIds).forEach(k => inputs[k] = document.getElementById(mapIds[k]));
      const resetBtn = document.getElementById('a11y-reset');

      // inicializa checkboxes a partir das prefs
      const prefsMap = { contrast:'highContrast', dark:'darkMode', motion:'reduceMotion', dyslexic:'dyslexicFont', links:'highlightLinks', roomy:'roomyText' };
      Object.entries(mapIds).forEach(([k,id]) => {
        const el = document.getElementById(id);
        if(el){
          el.checked = !!prefs[prefsMap[k]];
          el.addEventListener('change', () => {
            prefs[prefsMap[k]] = el.checked;
            applyPrefs(prefs); savePrefs(prefs);
          });
        }
      });

      if(scaleInput){
        scaleInput.addEventListener('input', (e) => {
          const v = parseFloat(e.target.value);
          prefs.scale = v;
          if(scaleLabel) scaleLabel.textContent = Math.round(v*100) + '%';
          applyPrefs(prefs); savePrefs(prefs);
        });
      }

      if(resetBtn){
        resetBtn.addEventListener('click', () => {
          prefs = Object.assign({}, defaultPrefs);
          applyPrefs(prefs);
          savePrefs(prefs);
          if(scaleInput){ scaleInput.value = prefs.scale; if(scaleLabel) scaleLabel.textContent = Math.round(prefs.scale*100)+'%'; }
          Object.values(inputs).forEach(i => { if(i) i.checked = false; });
        });
      }

      function openPanel(){ panel.style.display = 'block'; panel.setAttribute('aria-hidden','false'); btn.setAttribute('aria-expanded','true'); const focusable = panel.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'); if(focusable) focusable.focus(); }
      function closePanel(){ panel.style.display = 'none'; panel.setAttribute('aria-hidden','true'); btn.setAttribute('aria-expanded','false'); try{ btn.focus(); }catch(e){} }

      btn.addEventListener('click', () => { if(panel.style.display === 'none' || panel.style.display === '') openPanel(); else closePanel(); });

      // Atalhos
      window.addEventListener('keydown', (e) => {
        if(e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A')){ e.preventDefault(); if(panel.style.display === 'none' || panel.style.display === '') openPanel(); else closePanel(); }
        if(e.key === 'Escape'){ if(panel.style.display === 'block') closePanel(); }
      });

      // API pública
      window.A11y = {
        open: openPanel,
        close: closePanel,
        toggle: () => { if(panel.style.display === 'block') closePanel(); else openPanel(); },
        setScale: (v) => { prefs.scale = Number(v) || 1; applyPrefs(prefs); savePrefs(prefs); if(scaleInput) scaleInput.value = prefs.scale; if(scaleLabel) scaleLabel.textContent = Math.round(prefs.scale*100)+'%'; },
        adjustFont: (delta) => { const newScale = Math.min(1.6, Math.max(0.9, prefs.scale + delta)); window.A11y.setScale(newScale); },
        toggleContrast: () => { prefs.highContrast = !prefs.highContrast; applyPrefs(prefs); savePrefs(prefs); if(inputs.contrast) inputs.contrast.checked = prefs.highContrast; },
        toggleDark: () => { prefs.darkMode = !prefs.darkMode; applyPrefs(prefs); savePrefs(prefs); if(inputs.dark) inputs.dark.checked = prefs.darkMode; },
        toggleMotion: () => { prefs.reduceMotion = !prefs.reduceMotion; applyPrefs(prefs); savePrefs(prefs); if(inputs.motion) inputs.motion.checked = prefs.reduceMotion; },
        toggleDyslexic: () => { prefs.dyslexicFont = !prefs.dyslexicFont; applyPrefs(prefs); savePrefs(prefs); if(inputs.dyslexic) inputs.dyslexic.checked = prefs.dyslexicFont; },
        toggleLinks: () => { prefs.highlightLinks = !prefs.highlightLinks; applyPrefs(prefs); savePrefs(prefs); if(inputs.links) inputs.links.checked = prefs.highlightLinks; },
        toggleSpacing: () => { prefs.roomyText = !prefs.roomyText; applyPrefs(prefs); savePrefs(prefs); if(inputs.roomy) inputs.roomy.checked = prefs.roomyText; },
        reset: () => { prefs = Object.assign({}, defaultPrefs); applyPrefs(prefs); savePrefs(prefs); if(scaleInput){ scaleInput.value = prefs.scale; if(scaleLabel) scaleLabel.textContent = Math.round(prefs.scale*100)+'%'; } Object.values(inputs).forEach(i=>{ if(i) i.checked = false; }); }
      };

      // responsividade simples
      window.addEventListener('resize', () => {
        if(window.innerWidth < 380){ panel.style.right = '8px'; panel.style.left = '8px'; panel.style.width = 'auto'; }
        else { panel.style.right = '20px'; panel.style.left = ''; panel.style.width = '320px'; }
      });

      console.log('a11y: inicializado');
    } catch(err){
      console.error('a11y: erro fatal', err);
    }
  });
})();
