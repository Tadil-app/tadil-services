import { code128Svg } from './code128';
import { WaybillAlterationDTO, WaybillDTO, WaybillInformationDTO, WaybillPartyDTO } from './waybill.dto';

/**
 * The printable waybill ("بوليصة الطلب") attached to the garment bag.
 * Always in Arabic, so every bag carries the same label whoever prints it.
 * Sized for a 100 x 150 mm shipping label; long orders continue on the
 * next label.
 */

const UNITS: Record<string, string> = { cm: 'سم', inch: 'بوصة' };

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** One measurement or choice, e.g. "5 سم" or the chosen option's name. */
function informationText(info: WaybillInformationDTO): string {
  if (info.extraDetails?.arabicName) return info.extraDetails.arabicName;
  if (info.type === 'checkbox') return info.value === 'true' ? info.arabicName : '';
  const value = (info.value ?? '').trim();
  if (!value) return '';
  const unit = info.unit ? UNITS[info.unit] ?? info.unit : '';
  return unit ? `${value} ${unit}` : value;
}

/** One line per alteration, e.g. "تقصير الكم 5 سم". */
export function alterationLine(alteration: WaybillAlterationDTO): string {
  const details = alteration.informations.map(informationText).filter(Boolean).join(' · ');
  return details ? `${alteration.arabicName} ${details}` : alteration.arabicName;
}

function partyBlock(title: string, party: WaybillPartyDTO | null): string {
  if (!party) {
    return `<div class="party"><h3>${title}</h3><p class="muted">—</p></div>`;
  }
  const place = [party.address?.cityNameAr, party.address?.districtNameAr]
    .filter(Boolean)
    .join(' — ');
  return `
    <div class="party">
      <h3>${title}</h3>
      <p class="name">${escapeHtml(party.name)}</p>
      <p class="phone" dir="ltr">${escapeHtml(party.phone)}</p>
      <p>${escapeHtml(place)}</p>
    </div>`;
}

export function renderWaybillHtml(waybill: WaybillDTO, options: { autoPrint?: boolean } = {}): string {
  const reference = escapeHtml(waybill.orderReference);

  const pieces = waybill.pieces
    .map((piece, index) => {
      const name = piece.names?.arabicName || 'موديل مخصص';
      const lines = piece.alterations
        .map((alteration) => `<li>${escapeHtml(alterationLine(alteration))}</li>`)
        .join('');
      return `
        <section class="piece">
          <h4>القطعة <span class="num">${index + 1}</span> : ${escapeHtml(name)}</h4>
          <ul>${lines}</ul>
        </section>`;
    })
    .join('');

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>بوليصة الطلب ${reference}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;700&display=swap" rel="stylesheet">
<style>
  @page { size: 100mm 150mm; margin: 4mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; background: #fff; color: #000; }
  body {
    font-family: "Noto Kufi Arabic", "Geeza Pro", "Segoe UI", Tahoma, sans-serif;
    font-size: 13px;
    line-height: 1.45;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .sheet { width: 100%; max-width: 100mm; margin: 0 auto; padding: 4mm; overflow: hidden; }
  header { text-align: center; }
  header h1 { margin: 0; font-size: 24px; font-weight: 700; }
  header h2 { margin: 0; font-size: 17px; font-weight: 700; }
  .ref-row {
    display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center;
    gap: 8px; padding: 8px 0; border-bottom: 1.5px solid #000;
  }
  .ref-row .label { font-weight: 700; font-size: 14px; overflow-wrap: anywhere; }
  .ref-row .divider { width: 1.5px; align-self: stretch; background: #000; }
  .barcode { text-align: center; }
  .barcode svg { display: block; width: 100%; height: 44px; }
  .barcode .code { font-weight: 700; letter-spacing: 1px; direction: ltr; }
  .parties {
    display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); gap: 8px;
    padding: 8px 0; border-bottom: 1.5px solid #000;
  }
  .parties .divider { width: 1.5px; background: #000; }
  .party h3 { margin: 0 0 2px; font-size: 15px; }
  .party p { margin: 0; overflow-wrap: anywhere; }
  .party .name, .party .phone { font-size: 14px; }
  .muted { color: #555; }
  .summary { text-align: center; padding: 6px 0; border-bottom: 1.5px solid #000; }
  .summary h3 { margin: 0; font-size: 17px; }
  .summary p { margin: 0; font-weight: 700; }
  .piece { padding: 6px 0; border-bottom: 1px solid #000; break-inside: avoid; }
  .piece h4 { margin: 0 0 2px; font-size: 15px; }
  .num {
    display: inline-flex; align-items: center; justify-content: center;
    width: 20px; height: 20px; border: 1.5px solid #000; border-radius: 50%;
    font-size: 12px; line-height: 1; vertical-align: middle;
  }
  .piece ul { margin: 0; padding: 0 22px 0 0; list-style: none; }
  .piece li { margin: 0; }
  .toolbar { text-align: center; padding: 12px; }
  .toolbar button {
    font: inherit; font-weight: 700; padding: 10px 28px; border-radius: 10px;
    border: 0; background: #111; color: #fff;
  }
  @media print { .toolbar { display: none; } .sheet { padding: 0; } }
  /* Inside the app's preview the app has its own Print button. */
  .embedded .toolbar { display: none; }
</style>
</head>
<body>
  <script>if (window.self !== window.top) document.documentElement.classList.add('embedded');</script>
  <div class="toolbar"><button type="button" onclick="window.print()">طباعة البوليصة</button></div>
  <main class="sheet">
    <header>
      <h1>TADIL | تعديل</h1>
      <h2>بوليصة الطلب</h2>
    </header>

    <div class="ref-row">
      <div class="label">رقم الطلب: <span dir="ltr">${reference}</span></div>
      <div class="divider"></div>
      <div class="barcode">
        ${code128Svg(waybill.orderReference)}
        <div class="code">${reference}</div>
      </div>
    </div>

    <div class="parties">
      ${partyBlock('العميل', waybill.customer)}
      <div class="divider"></div>
      ${partyBlock('الخياط', waybill.tailor)}
    </div>

    <div class="summary">
      <h3>تفاصيل الطلب</h3>
      <p>إجمالي القطع: ${waybill.pieces.length}</p>
    </div>

    ${pieces}
  </main>
  ${options.autoPrint ? '<script>window.addEventListener("load", function () { setTimeout(function () { window.print(); }, 400); });</script>' : ''}
</body>
</html>`;
}
