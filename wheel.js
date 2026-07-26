/* Via Bag — عجلة الحظ */
(function () {
  const KEY_CODE = 'viabag_prize_v1';   // الجايزة المختارة حالياً
  const KEY_SEEN = 'viabag_wheel_seen';  // شافها قبل كده؟

  // الجوائز — كل واحدة لها كود
  const PRIZES = [
    { label: 'خصم 5%',                 code: 'VIA5',     color: '#0d2d5a' },
    { label: 'شحن مجاني',              code: 'FREESHIP', color: '#bcab95' },
    { label: 'خصم 100 جنيه',           code: 'VIA100',   color: '#071d3a' },
    { label: 'خصم 10% ع القطعة التانية', code: 'SECOND10', color: '#9a845c' },
    { label: 'خصم 7%',                 code: 'VIA7',     color: '#0d2d5a' },
  ];

  function getPrize() {
    try { return JSON.parse(localStorage.getItem(KEY_CODE)); } catch (e) { return null; }
  }
  function setPrize(p) {
    try { localStorage.setItem(KEY_CODE, JSON.stringify(p)); } catch (e) {}
    // حدّثي كود الخصم في السلة لو موجودة
    if (window.vbSetCoupon) window.vbSetCoupon(p ? p : null);
  }

  const css = `
  .vbw-ov{position:fixed;inset:0;background:rgba(7,29,58,.72);backdrop-filter:blur(6px);z-index:1400;
    display:none;align-items:center;justify-content:center;padding:20px}
  .vbw-ov.on{display:flex}
  .vbw-box{background:linear-gradient(160deg,#0a1f3d,#071d3a);border-radius:26px;padding:30px 26px;
    max-width:390px;width:100%;text-align:center;position:relative;box-shadow:0 30px 80px rgba(0,0,0,.5);
    border:1px solid rgba(188,171,149,.25)}
  .vbw-x{position:absolute;top:14px;left:16px;background:rgba(255,255,255,.12);border:none;color:#fff;
    width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:15px}
  .vbw-title{font-family:'Playfair Display',serif;color:#fff;font-size:24px;font-weight:700;margin-bottom:4px}
  .vbw-sub{color:#bcab95;font-size:13px;margin-bottom:20px}
  .vbw-wrap{position:relative;width:280px;height:280px;margin:0 auto 20px}
  .vbw-pointer{position:absolute;top:-6px;left:50%;transform:translateX(-50%);z-index:5;
    width:0;height:0;border-left:15px solid transparent;border-right:15px solid transparent;
    border-top:26px solid #d4453b;filter:drop-shadow(0 2px 3px rgba(0,0,0,.3))}
  .vbw-wheel{width:280px;height:280px;border-radius:50%;transition:transform 4.2s cubic-bezier(.17,.67,.12,.99);
    border:6px solid #bcab95;box-shadow:0 0 0 3px #071d3a,0 10px 30px rgba(0,0,0,.4)}
  .vbw-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:52px;height:52px;
    background:#fff;border-radius:50%;z-index:4;display:flex;align-items:center;justify-content:center;
    font-size:22px;box-shadow:0 3px 10px rgba(0,0,0,.3)}
  .vbw-btn{background:#bcab95;color:#071d3a;border:none;padding:14px 40px;border-radius:28px;font-size:16px;
    font-weight:700;cursor:pointer;font-family:'Cairo',sans-serif;transition:.2s}
  .vbw-btn:hover{background:#cdbfa8}
  .vbw-btn:disabled{opacity:.5;cursor:default}
  .vbw-result{display:none;margin-top:6px}
  .vbw-result.on{display:block}
  .vbw-prize{background:rgba(188,171,149,.14);border:1px dashed #bcab95;border-radius:14px;padding:16px;margin-bottom:14px}
  .vbw-prize .p-lbl{color:#fff;font-size:19px;font-weight:700;margin-bottom:8px}
  .vbw-code{background:#fff;color:#071d3a;font-size:20px;font-weight:800;letter-spacing:2px;padding:9px;
    border-radius:9px;font-family:monospace}
  .vbw-note{color:#bcab95;font-size:12px;margin-top:10px;line-height:1.7}
  .vbw-again{background:none;border:1px solid rgba(188,171,149,.4);color:#bcab95;padding:9px 20px;
    border-radius:22px;font-size:13px;cursor:pointer;font-family:'Cairo',sans-serif;margin-top:6px}
  .vbw-tab{position:fixed;bottom:92px;left:22px;z-index:899;background:#d4453b;color:#fff;border:none;
    padding:10px 16px;border-radius:24px;font-size:13px;font-weight:700;cursor:pointer;
    font-family:'Cairo',sans-serif;box-shadow:0 6px 18px rgba(212,69,59,.4);display:flex;align-items:center;gap:6px}
  @media(max-width:600px){.vbw-tab{bottom:80px;left:16px;font-size:12px;padding:9px 13px}}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const n = PRIZES.length;
  const seg = 360 / n;

  function wheelGradient() {
    let parts = [];
    for (let i = 0; i < n; i++) {
      parts.push(`${PRIZES[i].color} ${i * seg}deg ${(i + 1) * seg}deg`);
    }
    return `conic-gradient(${parts.join(',')})`;
  }

  function labelsSVG() {
    // نص كل جزء
    let els = '';
    for (let i = 0; i < n; i++) {
      const ang = i * seg + seg / 2;
      els += `<div style="position:absolute;top:50%;left:50%;transform-origin:0 0;
        transform:rotate(${ang}deg) translate(58px,-8px);width:80px;color:#fff;font-size:10px;
        font-weight:700;text-align:center;font-family:'Cairo',sans-serif;line-height:1.15;
        pointer-events:none">${PRIZES[i].label}</div>`;
    }
    return els;
  }

  const ov = document.createElement('div');
  ov.className = 'vbw-ov';
  ov.innerHTML = `
    <div class="vbw-box">
      <button class="vbw-x" id="vbwX">✕</button>
      <div class="vbw-title">عجلة الحظ 🎡</div>
      <div class="vbw-sub">لِفّي العجلة واكسبي خصم على طلبك!</div>
      <div class="vbw-wrap">
        <div class="vbw-pointer"></div>
        <div class="vbw-wheel" id="vbwWheel" style="background:${wheelGradient()}">
        </div>
        <div style="position:absolute;inset:0" id="vbwLabels">${labelsSVG()}</div>
        <div class="vbw-center">🎁</div>
      </div>
      <button class="vbw-btn" id="vbwSpin">لِفّي العجلة</button>
      <div class="vbw-result" id="vbwResult">
        <div class="vbw-prize">
          <div class="p-lbl" id="vbwPrizeLbl"></div>
          <div class="vbw-code" id="vbwCode"></div>
        </div>
        <div class="vbw-note">✓ الكود اتحفظ تلقائياً وهيتضاف لطلبك في السلة</div>
        <button class="vbw-again" id="vbwAgain">لِفّي تاني 🔄</button>
      </div>
    </div>`;

  const tab = document.createElement('button');
  tab.className = 'vbw-tab';
  tab.innerHTML = '🎡 عجلة الحظ';
  tab.onclick = openW;

  let booted = false;
  function boot() {
    if (booted) return; booted = true;
    document.body.appendChild(ov);
    document.body.appendChild(tab);
    document.getElementById('vbwX').onclick = closeW;
    document.getElementById('vbwSpin').onclick = spin;
    document.getElementById('vbwAgain').onclick = resetSpin;
    ov.addEventListener('click', e => { if (e.target === ov) closeW(); });
    // أول زيارة → افتحيها تلقائياً بعد ثانية
    if (!localStorage.getItem(KEY_SEEN)) {
      setTimeout(openW, 1200);
      try { localStorage.setItem(KEY_SEEN, '1'); } catch (e) {}
    }
  }
  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);

  function openW() { ov.classList.add('on'); }
  function closeW() { ov.classList.remove('on'); }

  let spinning = false, currentRot = 0;
  function spin() {
    if (spinning) return;
    spinning = true;
    document.getElementById('vbwSpin').disabled = true;
    const idx = Math.floor(Math.random() * n);
    // conic-gradient يبدأ من أعلى (12) باتجاه عقارب الساعة.
    // منتصف الجزء idx زاويته (idx*seg + seg/2) من أعلى باتجاه العقارب.
    // عشان يوصل تحت المؤشر (أعلى)، نلف الدولاب عكس العقارب بنفس الزاوية.
    const mid = idx * seg + seg / 2;
    const base = currentRot - (currentRot % 360);       // ابدئي من دورة كاملة
    const target = base + 360 * 5 + (360 - mid);
    currentRot = target;
    const w = document.getElementById('vbwWheel');
    w.style.transform = `rotate(${currentRot}deg)`;
    setTimeout(() => {
      const p = PRIZES[idx];
      setPrize(p);
      document.getElementById('vbwPrizeLbl').textContent = '🎉 مبروك! ' + p.label;
      document.getElementById('vbwCode').textContent = p.code;
      document.getElementById('vbwResult').classList.add('on');
      document.getElementById('vbwSpin').style.display = 'none';
      spinning = false;
    }, 4300);
  }
  function resetSpin() {
    document.getElementById('vbwResult').classList.remove('on');
    document.getElementById('vbwSpin').style.display = 'inline-block';
    document.getElementById('vbwSpin').disabled = false;
  }

  // expose for cart
  window.vbGetPrize = getPrize;
})();
