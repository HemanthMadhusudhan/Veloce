import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || 're_YxZ9842_placeholder';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    
    if (payload.type !== 'INSERT' || !payload.record) {
      return new Response(JSON.stringify({ error: 'Ignored payload' }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      });
    }

    const order = payload.record;
    
    if (!order.customer || !order.customer.email) {
      return new Response(JSON.stringify({ error: 'No customer email found in order' }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 400,
      });
    }

    const customerEmail = order.customer.email;
    const customerName = order.customer.name || 'Valued Fan';
    const subtotal = order.subtotal || order.total || 0;
    const discount = order.discount || 0;
    const total = order.total || 0;
    const items = order.items || [];
    const orderId = order.orderNumber || (order.id ? (order.id.startsWith('VEL-') ? order.id : 'VEL-' + order.id.split('-')[0].toUpperCase()) : `VEL-${Date.now().toString(36).toUpperCase()}`);
    
    // Accurate payment method formatting
    let paymentMode = 'Online Prepaid (UPI / Cards / Netbanking)';
    if (order.payment?.mode === 'cod' || order.payment?.method === 'cod') {
      const codDue = order.payment?.codDue || (subtotal - discount - 80);
      paymentMode = `Cash on Delivery (₹80 Advance Paid · Balance ₹${Math.max(0, codDue)} Due on Delivery)`;
    } else if (order.payment?.mode === 'wallet' || order.payment?.method === 'wallet') {
      paymentMode = 'Store Wallet (Full Payment)';
    }

    // Generate Items HTML with proper images, names, customization, and prices
    const itemsHtml = items.map((item: any) => {
      const itemName = item.name || 'Official Veloce Matchwear';
      const itemImg = item.image || item.images?.[0] || 'https://velocewear.shop/logo.png';
      const itemPrice = item.price || Math.round(total / (items.length || 1));
      const itemQty = item.qty || 1;
      const itemSize = item.size || 'M';
      const customInfo = (item.customName || item.customNumber) 
        ? `<div style="font-size: 11px; color: #d32f2f; margin-top: 2px;">Custom: ${item.customName || ''} ${item.customNumber ? '#' + item.customNumber : ''}</div>` 
        : '';

      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; width: 70px; vertical-align: middle;">
            <img src="${itemImg}" alt="${itemName}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: contain; background: #f7f7f7; display: block; border: 1px solid #eee;" />
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; vertical-align: middle;">
            <p style="margin: 0; font-weight: 700; font-size: 14px; color: #111;">${itemName}</p>
            <p style="margin: 3px 0 0; font-size: 12px; color: #666;">Size: <strong>${itemSize}</strong> · Qty: <strong>${itemQty}</strong></p>
            ${customInfo}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right; vertical-align: middle; font-weight: 700; color: #000; font-size: 14px;">
            ₹${(itemPrice * itemQty).toLocaleString('en-IN')}
          </td>
        </tr>
      `;
    }).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e4e4e7; }
          .header { background: #000000; padding: 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 8px 0 0; font-size: 22px; letter-spacing: 2px; font-weight: 900; }
          .content { padding: 28px 24px; }
          .greeting { font-size: 20px; font-weight: 800; color: #18181b; margin: 0 0 8px; }
          .order-badge { display: inline-block; background: #f4f4f5; border: 1px solid #e4e4e7; padding: 6px 12px; border-radius: 8px; font-family: monospace; font-weight: 700; font-size: 13px; margin: 10px 0 16px; color: #18181b; }
          .table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          .total-row td { padding: 8px 12px; text-align: right; font-size: 13px; color: #52525b; }
          .grand-total td { padding: 14px 12px 6px; text-align: right; font-weight: 800; font-size: 17px; color: #09090b; border-top: 2px solid #18181b; }
          .card-grid { display: flex; gap: 12px; margin-top: 24px; }
          .info-card { flex: 1; background: #fbfbfb; border: 1px solid #e4e4e7; border-radius: 12px; padding: 14px; font-size: 12px; }
          .info-card h4 { margin: 0 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #71717a; font-weight: 700; }
          .footer { text-align: center; padding: 20px; font-size: 11px; color: #a1a1aa; border-top: 1px solid #f4f4f5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://velocewear.shop/logo.png" alt="Veloce Wear" style="height: 36px; display: inline-block;" />
            <h1>VELOCE WEAR</h1>
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #a1a1aa; margin-top: 2px;">Four Worlds. One Atelier.</div>
          </div>
          
          <div class="content">
            <h2 class="greeting">Thank you for your order, ${customerName}!</h2>
            <p style="margin: 0; font-size: 14px; color: #52525b; line-height: 1.5;">
              Your order has been confirmed and is being prepared for dispatch with express tracking.
            </p>

            <div class="order-badge">ORDER ID: ${orderId}</div>

            <table class="table">
              <thead>
                <tr style="background: #fafafa; border-bottom: 2px solid #e5e5e5;">
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #71717a;" colspan="2">Item Details</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #71717a;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr class="total-row">
                  <td colspan="2">Subtotal</td>
                  <td style="font-weight: 600; color: #18181b;">₹${subtotal.toLocaleString('en-IN')}</td>
                </tr>
                ${discount > 0 ? `
                <tr class="total-row">
                  <td colspan="2" style="color: #15803d; font-weight: 600;">Promo / Discount</td>
                  <td style="color: #15803d; font-weight: 700;">- ₹${discount.toLocaleString('en-IN')}</td>
                </tr>` : ''}
                <tr class="total-row">
                  <td colspan="2">Express Shipping</td>
                  <td style="color: #15803d; font-weight: 700;">FREE</td>
                </tr>
                <tr class="grand-total">
                  <td colspan="2">Amount Paid</td>
                  <td>₹${total.toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>

            <table style="width: 100%; margin-top: 24px; border-collapse: separate; border-spacing: 10px 0;">
              <tr>
                <td style="width: 50%; vertical-align: top; background: #fafafa; border: 1px solid #e5e5e5; border-radius: 12px; padding: 14px; font-size: 12px; color: #3f3f46;">
                  <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #71717a; margin-bottom: 6px;">Shipping Address</div>
                  <strong>${customerName}</strong><br/>
                  ${order.customer.address}<br/>
                  ${order.customer.city}, ${order.customer.state} ${order.customer.pincode}<br/>
                  Phone: +91-${order.customer.phone}
                </td>
                <td style="width: 50%; vertical-align: top; background: #fafafa; border: 1px solid #e5e5e5; border-radius: 12px; padding: 14px; font-size: 12px; color: #3f3f46;">
                  <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #71717a; margin-bottom: 6px;">Payment Method</div>
                  <strong>${paymentMode}</strong>
                </td>
              </tr>
            </table>
          </div>

          <div class="footer">
            <p style="margin: 0 0 4px;">Need help with your order? Contact us at support@velocewear.shop</p>
            <p style="margin: 0;">© 2026 Veloce Wear. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'orders@velocewear.shop',
        to: [customerEmail],
        bcc: ['hemanthmadhusudhan@gmail.com'],
        subject: `Order Confirmation #${orderId}`,
        html: html,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: res.ok ? 200 : 400,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500,
    });
  }
});
