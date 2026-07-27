/* Via Bag — سلة التسوق المشتركة */
(function () {
  const WA = '201223311833';
  const KEY = 'viabag_cart_v1';

  /* ---------- التخزين ---------- */
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function save(c) {
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
  }
  let cart = load();

  /* ---------- التصميم ---------- */
  const css = `
  .vb-fab{position:fixed;bottom:22px;left:22px;z-index:900;width:60px;height:60px;border-radius:50%;
    background:#071d3a;color:#bcab95;border:none;cursor:pointer;font-size:24px;
    box-shadow:0 8px 24px rgba(7,29,58,.32);display:flex;align-items:center;justify-content:center;
    transition:transform .2s}
  .vb-fab:hover{transform:scale(1.08)}
  .vb-fab .vb-count{position:absolute;top:-4px;right:-4px;background:#d4453b;color:#fff;font-size:12px;
    font-weight:700;min-width:23px;height:23px;border-radius:12px;display:none;align-items:center;
    justify-content:center;font-family:'Cairo',sans-serif;padding:0 6px}
  .vb-fab .vb-count.on{display:flex}
  .vb-ov{position:fixed;inset:0;background:rgba(7,29,58,.55);backdrop-filter:blur(4px);z-index:1190;display:none}
  .vb-ov.on{display:block}
  .vb-panel{position:fixed;top:0;left:0;height:100%;width:400px;max-width:92vw;background:#f5f0ea;z-index:1200;
    transform:translateX(-102%);transition:transform .3s;display:flex;flex-direction:column;
    font-family:'Cairo',sans-serif;box-shadow:6px 0 40px rgba(0,0,0,.2)}
  .vb-panel.on{transform:translateX(0)}
  .vb-head{background:#071d3a;color:#fff;padding:20px 22px;display:flex;align-items:center;justify-content:space-between}
  .vb-head h3{font-size:18px;font-weight:700;margin:0}
  .vb-x{background:rgba(255,255,255,.12);border:none;color:#fff;width:32px;height:32px;border-radius:50%;
    cursor:pointer;font-size:16px}
  .vb-body{flex:1;overflow-y:auto;padding:16px}
  .vb-empty{text-align:center;color:#8a8a96;padding:60px 20px;font-size:14px;line-height:2}
  .vb-item{background:#fff;border-radius:14px;padding:13px;margin-bottom:11px;display:flex;gap:11px;align-items:flex-start}
  .vb-item img{width:62px;height:62px;object-fit:contain;background:#f5f0ea;border-radius:9px;flex-shrink:0}
  .vb-i-info{flex:1;min-width:0}
  .vb-i-name{font-size:14px;font-weight:700;color:#071d3a;margin-bottom:3px}
  .vb-i-meta{font-size:11px;color:#6a6a76;line-height:1.6}
  .vb-i-price{font-size:15px;font-weight:700;color:#071d3a;margin-top:5px}
  .vb-qty{display:flex;align-items:center;gap:7px;margin-top:7px}
  .vb-qb{width:25px;height:25px;border-radius:7px;border:1px solid #ded3c0;background:#fff;cursor:pointer;
    font-size:15px;line-height:1;color:#071d3a}
  .vb-qn{font-size:13px;font-weight:700;min-width:20px;text-align:center}
  .vb-del{background:none;border:none;color:#d4453b;cursor:pointer;font-size:12px;padding:3px 0;margin-top:5px}
  .vb-foot{background:#fff;padding:18px 20px;border-top:1px solid #e5dccb}
  .vb-total{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
  .vb-total span{font-size:14px;color:#4a4a5a}
  .vb-total b{font-size:25px;color:#071d3a}
  .vb-inp{width:100%;margin-bottom:9px;background:#f5f0ea;border:1.5px solid rgba(188,171,149,.45);
    border-radius:9px;padding:12px 15px;font-size:14px;font-family:'Cairo',sans-serif}
  .vb-inp:focus{outline:none;border-color:#071d3a}
  .vb-send{width:100%;background:#25D366;color:#fff;border:none;padding:14px;border-radius:11px;
    font-size:15px;font-weight:700;cursor:pointer;font-family:'Cairo',sans-serif}
  .vb-send:hover{opacity:.92}
  .vb-toast{position:fixed;bottom:96px;left:22px;background:#071d3a;color:#bcab95;padding:11px 22px;
    border-radius:26px;font-size:13px;font-family:'Cairo',sans-serif;z-index:1300;opacity:0;
    transform:translateY(10px);transition:all .3s;pointer-events:none}
  .vb-toast.on{opacity:1;transform:translateY(0)}
  @media(max-width:600px){.vb-fab{bottom:16px;left:16px;width:54px;height:54px;font-size:21px}}
  `;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- الواجهة ---------- */
  const fab = document.createElement('button');
  fab.className = 'vb-fab';
  fab.innerHTML = '🛒<span class="vb-count" id="vbCount">0</span>';
  fab.onclick = open;

  const ov = document.createElement('div');
  ov.className = 'vb-ov';
  ov.onclick = close;

  const panel = document.createElement('div');
  panel.className = 'vb-panel';
  panel.innerHTML = `
    <div class="vb-head"><h3>سلة التسوق 🛒</h3><button class="vb-x" id="vbX">✕</button></div>
    <div class="vb-body" id="vbBody"></div>
    <div class="vb-foot" id="vbFoot" style="display:none">
      <div id="vbCoupon" style="display:none;background:#eaf7ee;border:1px solid #b6e0c2;border-radius:9px;padding:9px 13px;margin-bottom:11px;font-size:13px;color:#1a7d3c;font-weight:600;display:flex;align-items:center;justify-content:space-between">
        <span id="vbCouponTxt"></span>
        <button onclick="vbClearCoupon()" style="background:none;border:none;color:#d4453b;cursor:pointer;font-size:12px">إزالة</button>
      </div>
      <div class="vb-total"><span>الإجمالي</span><b id="vbTotal">0 ج</b></div>
      <input class="vb-inp" id="vbName" placeholder="اسمك">
      <input class="vb-inp" id="vbPhone" type="tel" placeholder="رقم الواتساب">
      <input class="vb-inp" id="vbCity" placeholder="المحافظة / العنوان">
      <button class="vb-send" id="vbSend">إتمام الطلب عبر واتساب 💬</button>
    </div>`;

  const toast = document.createElement('div');
  toast.className = 'vb-toast';

  document.addEventListener('DOMContentLoaded', boot);
  if (document.readyState !== 'loading') boot();
  let booted = false;
  function boot() {
    if (booted) return; booted = true;
    document.body.appendChild(fab);
    document.body.appendChild(ov);
    document.body.appendChild(panel);
    document.body.appendChild(toast);
    document.getElementById('vbX').onclick = close;
    document.getElementById('vbSend').onclick = checkout;
    draw();
  }

  function open() { ov.classList.add('on'); panel.classList.add('on'); }
  function close() { ov.classList.remove('on'); panel.classList.remove('on'); }

  function say(msg) {
    toast.textContent = msg;
    toast.classList.add('on');
    setTimeout(() => toast.classList.remove('on'), 1900);
  }

  /* ---------- المنطق ---------- */
  window.vbAdd = function (item) {
    const k = item.code + '|' + (item.variant || '');
    const ex = cart.find(x => x.key === k);
    if (ex) ex.qty++;
    else cart.push({ key: k, code: item.code, name: item.name, variant: item.variant || '',
                     price: Number(item.price) || 0, img: item.img || '', qty: 1 });
    save(cart); draw(); say('تمت الإضافة للسلة ✓');
  };

  function chgByIndex(i, d) {
    if (!cart[i]) return;
    cart[i].qty += d;
    if (cart[i].qty < 1) cart.splice(i, 1);
    save(cart); draw();
  }
  function delByIndex(i) {
    if (!cart[i]) return;
    cart.splice(i, 1); save(cart); draw();
  }
  window.vbChgByIndex = chgByIndex; window.vbDelByIndex = delByIndex;

  /* ---------- كوبون عجلة الحظ ---------- */
  let coupon = null;
  try { coupon = JSON.parse(localStorage.getItem('viabag_prize_v1')); } catch(e){}
  window.vbSetCoupon = function(p){ coupon = p; save(cart); draw(); };
  window.vbClearCoupon = function(){
    coupon = null;
    try { localStorage.removeItem('viabag_prize_v1'); } catch(e){}
    draw();
  };
  function couponLine(){
    if(!coupon) return '';
    return `🎁 ${coupon.label} — كود: ${coupon.code}`;
  }


  /* ---------- حساب الخصم ---------- */
  function subtotal(){ return cart.reduce((s,x)=>s+x.price*x.qty,0); }
  function discountAmount(){
    if(!coupon) return {amount:0, ship:false, label:''};
    const sub=subtotal();
    switch(coupon.code){
      case 'VIA5':     return {amount:Math.round(sub*0.05), ship:false, label:'خصم 5%'};
      case 'VIA7':     return {amount:Math.round(sub*0.07), ship:false, label:'خصم 7%'};
      case 'VIA100':   return {amount:Math.min(100,sub),    ship:false, label:'خصم 100 ج'};
      case 'FREESHIP': return {amount:0, ship:true,  label:'شحن مجاني'};
      case 'SECOND10': {
        // خصم 10% على أرخص قطعة تانية (لو فيه قطعتين+)
        const items=[]; cart.forEach(x=>{for(let k=0;k<x.qty;k++)items.push(x.price);});
        if(items.length<2) return {amount:0, ship:false, label:'خصم 10% ع القطعة التانية (تحتاجين قطعتين)'};
        items.sort((a,b)=>a-b);
        return {amount:Math.round(items[items.length-2]*0.10), ship:false, label:'خصم 10% ع القطعة التانية'};
      }
      default: return {amount:0, ship:false, label:''};
    }
  }


  function draw() {
    const c = document.getElementById('vbCount');
    const n = cart.reduce((s, x) => s + x.qty, 0);
    if (c) { c.textContent = n; c.classList.toggle('on', n > 0); }

    const body = document.getElementById('vbBody');
    const foot = document.getElementById('vbFoot');
    if (!body) return;

    if (!cart.length) {
      body.innerHTML = '<div class="vb-empty">🛍️<br>سلتك فاضية<br><small>أضيفي منتجات وابدئي التسوق</small></div>';
      foot.style.display = 'none';
      return;
    }
    body.innerHTML = cart.map((x, i) => `
      <div class="vb-item">
        ${x.img ? `<img src="${x.img}" alt="${x.name}">` : ''}
        <div class="vb-i-info">
          <div class="vb-i-name">${x.name}</div>
          <div class="vb-i-meta">${x.code}${x.variant ? ' · ' + x.variant : ''}</div>
          <div class="vb-i-price">${x.price} ج</div>
          <div class="vb-qty">
            <button class="vb-qb" data-act="dec" data-i="${i}">−</button>
            <span class="vb-qn">${x.qty}</span>
            <button class="vb-qb" data-act="inc" data-i="${i}">+</button>
          </div>
          <button class="vb-del" data-act="del" data-i="${i}">حذف</button>
        </div>
      </div>`).join('');
    // event delegation (يتحمّل المفاتيح اللي فيها رموز)
    body.querySelectorAll('[data-act]').forEach(b=>{
      b.onclick=()=>{
        const i=+b.getAttribute('data-i'), act=b.getAttribute('data-act');
        if(act==='inc') chgByIndex(i,1);
        else if(act==='dec') chgByIndex(i,-1);
        else if(act==='del') delByIndex(i);
      };
    });
    foot.style.display = 'block';
    const sub = subtotal();
    const d = discountAmount();
    const finalT = sub - d.amount;
    document.getElementById('vbTotal').textContent = finalT + ' ج';
    const cp = document.getElementById('vbCoupon');
    if (cp) {
      if (coupon) {
        cp.style.display='flex';
        let txt = '🎁 ' + d.label;
        if (d.amount>0) txt += ' (−'+d.amount+' ج)';
        if (d.ship) txt += ' 🚚';
        document.getElementById('vbCouponTxt').textContent = txt;
      } else { cp.style.display='none'; }
    }
  }


  function checkout() {
    const n = document.getElementById('vbName').value.trim();
    const p = document.getElementById('vbPhone').value.trim();
    const c = document.getElementById('vbCity').value.trim();
    if (!n || !p) { alert('من فضلك أدخلي اسمك ورقم الواتساب'); return; }
    let m = 'مرحباً Via Bag 👜\n\nطلب جديد:\n\n';
    cart.forEach((x, i) => {
      m += `${i + 1}) ${x.name}\n   الكود: ${x.code}\n`;
      if (x.variant) m += `   ${x.variant}\n`;
      m += `   الكمية: ${x.qty} × ${x.price} ج = ${x.qty * x.price} ج\n\n`;
    });
    const sub = subtotal();
    const d = discountAmount();
    m += `الإجمالي قبل الخصم: ${sub} ج\n`;
    if (coupon) {
      m += `🎁 كوبون: ${coupon.label} (${coupon.code})\n`;
      if (d.amount>0) m += `الخصم: −${d.amount} ج\n`;
      if (d.ship) m += `🚚 شحن مجاني\n`;
      m += `الإجمالي بعد الخصم: ${sub - d.amount} ج\n`;
    }
    m += `\n`;
    m += `👤 الاسم: ${n}\n📱 الواتساب: ${p}\n📍 المحافظة: ${c || 'لم تحدد'}`;
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(m), '_blank');
  }
})();
