import { ShippingLabelDTO } from "@/integration/dtos";
import { formatDate } from "@/utils";

export function getOrderLableHtml(label: ShippingLabelDTO, t: (key: string, ...args: any[]) => string) {
    const itemsHtml = label.items
      .map(
        (item) => `
      <tr>
        <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">${item.name}</td>
        <td style="font-size: 13px; color: #555; padding: 8px; border: 1px solid #ddd;">${item.details}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">1</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.price} ${t("common.currencies.sar")}</td>
        <td style="text-align: right; font-weight: bold; padding: 8px; border: 1px solid #ddd;">${item.price} ${t("common.currencies.sar")}</td>
      </tr>
    `
      )
      .join("");
      
      return `
      <html dir="${t('common.dir') || 'ltr'}">
      <head>
        <title>Tadil Shipping Label #${label.orderReference}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            padding: 40px;
            color: #333;
            direction: ${t('common.dir') || 'ltr'};
          }
          .header {
            text-align: center;
            border-bottom: 2px dashed #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 { margin: 0 0 10px 0; font-size: 28px; letter-spacing: 2px; }
          .header p { margin: 5px 0; font-size: 14px; }
          .reference { font-size: 20px; font-weight: bold; margin-top: 10px; }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }
          .box {
            border: 1px solid #aaa;
            padding: 20px;
            border-radius: 12px;
            background-color: #fafafa;
          }
          .box h3 { margin: 0 0 12px 0; border-bottom: 1px solid #ccc; padding-bottom: 6px; font-size: 16px; color: #111; }
          .box p { margin: 8px 0; font-size: 14px; line-height: 1.4; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: ${t('common.dir') === 'rtl' ? 'right' : 'left'};
            padding: 8px;
            border: 1px solid #ddd;
          }
          .total {
            text-align: ${t('common.dir') === 'rtl' ? 'left' : 'right'};
            font-size: 20px;
            font-weight: bold;
            margin-top: 25px;
            padding-top: 15px;
            border-top: 2px solid #333;
          }
          .close-print {
            position: fixed;
            top: max(16px, env(safe-area-inset-top));
            inset-inline-start: 16px;
            z-index: 10;
            border: 0;
            border-radius: 999px;
            padding: 10px 18px;
            color: #fff;
            background: #6d0f2f;
            font: inherit;
            font-weight: 700;
          }
          @media print {
            body { padding: 10px; }
            .box { background-color: transparent; }
            .close-print { display: none; }
          }
        </style>
      </head>
      <body>
        <button class="close-print" type="button" onclick="window.close()">× ${t('login.form.buttons.back')}</button>
        <div class="header">
          <h1>TADIL - تـعـديـل</h1>
          <p>${t('courier.print.title')}</p>
          <div class="reference">${t('courier.print.orderRef')}${label.orderReference}</div>
          <p><strong>${t('courier.print.date')}</strong> ${formatDate(label.orderDate)}</p>
        </div>

        <div class="grid">
          <div class="box">
            <h3>${t('courier.print.from')}</h3>
            <p><strong>${t('courier.print.name')}</strong> ${label.customerName}</p>
            <p><strong>${t('courier.print.phone')}</strong> ${label.customerPhone}</p>
            <p><strong>${t('courier.print.address')}</strong> ${label.customerAddress}</p>
          </div>
          <div class="box">
            <h3>${t('courier.print.to')}</h3>
            <p><strong>${t('courier.print.name')}</strong> ${label.tailorName || t('common.notApplicable')}</p>
            <p><strong>${t('courier.print.phone')}</strong> ${label.tailorPhone || t('common.notApplicable')}</p>
            <p><strong>${t('courier.print.address')}</strong> ${label.tailorAddress || t('common.notApplicable')}</p>
          </div>
        </div>

        <div>
          <h3>${t('courier.print.orderDetails')}</h3>
          <table>
            <thead>
              <tr>
                <th>${t('courier.print.item')}</th>
                <th>${t('courier.print.details')}</th>
                <th style="text-align: center;">${t('courier.print.qty')}</th>
                <th style="text-align: ${t('common.dir') === 'rtl' ? 'left' : 'right'};">${t('courier.print.unitPrice')}</th>
                <th style="text-align: ${t('common.dir') === 'rtl' ? 'left' : 'right'};">${t('courier.print.total')}</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="total">
            ${t('courier.print.grandTotal')} ${label.totalPrice} ${t("common.currencies.sar")}
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;
}