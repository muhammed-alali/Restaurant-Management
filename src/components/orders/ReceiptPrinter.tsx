'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { QRCode } from 'antd';
import type { Order } from '@/types';

interface ReceiptPrinterProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  cashierName?: string;
}

// ─── Hidden print area ──────────────────────────────────────────────
// Rendered off-screen so the browser print dialog shows only the
// receipt (no preview modal is displayed to the user).

const PrintRoot = styled.div`
  position: absolute;
  left: -10000px;
  top: 0;
  width: 360px;
`;

// ─── Thermal POS Receipt (80mm) Styling ─────────────────────────────

const ThermalPaper = styled.div`
  width: 340px;
  background: #FFFFFF;
  padding: 24px 20px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
  color: #1E293B;
  font-size: 13px;
  line-height: 1.4;
  direction: rtl;
`;

const HeaderSection = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 14px;
`;

const LogoBox = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 8px;
  border: 2px solid #F06436;
`;

const RestaurantName = styled.h2`
  font-size: 20px;
  font-weight: 800;
  color: #0F172A;
  margin: 0;
`;

const Tagline = styled.p`
  font-size: 12px;
  color: #F06436;
  font-weight: 600;
  margin: 2px 0 6px 0;
`;

const SubHeaderInfo = styled.div`
  font-size: 11px;
  color: #64748B;
  line-height: 1.4;
`;

const DottedDivider = styled.div`
  border-top: 1px dashed #CBD5E1;
  margin: 10px 0;
  width: 100%;
`;

const DoubleLineDivider = styled.div`
  border-top: 3px double #94A3B8;
  margin: 12px 0;
  width: 100%;
`;

const MetaGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  margin-bottom: 10px;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MetaLabel = styled.span`
  color: #64748B;
`;

const MetaValue = styled.span`
  font-weight: 600;
  color: #0F172A;
`;

// Items Table
const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  font-size: 12px;

  th {
    text-align: right;
    color: #475569;
    font-weight: 700;
    padding-bottom: 6px;
    border-bottom: 1px solid #CBD5E1;
  }

  td {
    padding: 6px 0;
    vertical-align: top;
  }
`;

const ItemTitle = styled.div`
  font-weight: 600;
  color: #0F172A;
`;

const ItemSubnote = styled.div`
  font-size: 10px;
  color: #D97706;
  margin-top: 1px;
`;

// Financials
const CalculationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12px;
  margin: 10px 0;
`;

const CalcRow = styled.div<{ $bold?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: ${({ $bold }) => ($bold ? '700' : '500')};
  color: ${({ $bold }) => ($bold ? '#0F172A' : '#475569')};
`;

const GrandTotalBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #F8FAFC;
  border: 1px solid #E2E8F0;
  padding: 10px 12px;
  border-radius: 6px;
  margin: 10px 0;
  font-size: 15px;
  font-weight: 800;
  color: #0F172A;

  .price {
    font-size: 17px;
    color: #F06436;
  }
`;

const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 14px;
  gap: 6px;
`;

const BarcodeSim = styled.div`
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 5px;
  font-size: 16px;
  font-weight: 700;
  color: #334155;
  margin-top: 4px;
`;

const FooterNote = styled.p`
  text-align: center;
  font-size: 11px;
  color: #64748B;
  margin: 10px 0 0 0;
  line-height: 1.5;
`;

// ─── Component Implementation ───────────────────────────────────────

export function ReceiptPrinter({
  order,
  open,
  onClose,
  cashierName = 'أحمد محمد',
}: ReceiptPrinterProps) {
  // Keep the latest callback without re-triggering the print effect.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Print as soon as the receipt and its logo are ready — the user never
  // sees a preview modal, only the browser print dialog.
  useEffect(() => {
    if (!open || !order) return;

    let cancelled = false;
    let scheduled = false;
    let timer: number | undefined;

    const trigger = () => {
      if (cancelled || scheduled) return;
      scheduled = true;
      // Give the browser a moment to paint the receipt and QR code.
      timer = window.setTimeout(() => {
        if (cancelled) return;
        window.print();
        onCloseRef.current();
      }, 200);
    };

    // Make sure the logo is actually loaded before printing; otherwise it
    // can be missing from the printed receipt.
    const logo = new window.Image();
    logo.onload = trigger;
    logo.onerror = trigger;
    logo.src = '/images/logo/logo.jpg';
    if (logo.complete) trigger();

    // Safety net in case loading the image hangs.
    const fallback = window.setTimeout(trigger, 1500);

    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
      window.clearTimeout(fallback);
      logo.onload = null;
      logo.onerror = null;
    };
  }, [open, order]);

  if (!order || !open || typeof document === 'undefined') return null;

  // Financial calculations
  const total = order.total || 0;
  const subtotalBeforeVat = Number((total / 1.15).toFixed(2));
  const vatAmount = Number((total - subtotalBeforeVat).toFixed(2));

  // Date formatting
  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const formattedTime = orderDate.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const orderTypeArabic =
    order.type === 'DINE_IN'
      ? `داخل المطعم (طاولة ${order.tableNumber ?? '-'})`
      : order.type === 'TAKEAWAY'
        ? 'استلام سفري'
        : 'توصيل منزلي';

  // ZATCA-compliant QR data payload simulation
  const qrString = `HumHum|310294857200003|${orderDate.toISOString()}|${total.toFixed(
    2,
  )}|${vatAmount.toFixed(2)}`;

  return createPortal(
    <>
      {/* ── Global Print Media CSS ── */}
      <style jsx global>{`
        @media print {
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }
          /* Hide the whole app and keep only the receipt overlay, so the
             print job always stays on a single page. */
          body > *:not(#receipt-print-root) {
            display: none !important;
          }
          #receipt-print-root {
            display: flex !important;
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            width: auto !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            align-items: center !important;
            justify-content: center !important;
            background: #ffffff !important;
          }
          /* Center the 80mm receipt both horizontally and vertically
             (y = 50%) on the printed page. */
          #printable-invoice-content {
            position: static !important;
            width: 340px !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          #printable-invoice-content > div {
            width: 100% !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            margin: 4mm;
            size: auto;
          }
        }
      `}</style>

      <PrintRoot id="receipt-print-root" aria-hidden="true">
        <div id="printable-invoice-content">
          <ThermalPaper>
            <HeaderSection>
              <LogoBox>
                <img
                  src="/images/logo/logo.jpg"
                  alt="HumHum"
                  width={52}
                  height={52}
                  loading="eager"
                  style={{ width: 52, height: 52, objectFit: 'cover', display: 'block' }}
                />
              </LogoBox>
              <RestaurantName>HumHum</RestaurantName>
              <Tagline>طعم لا يُنسى</Tagline>
              <SubHeaderInfo>
                فاتورة ضريبية مبسطة
                <br />
                تركيا — إسطنبول
                <br />
                الرقم الضريبي: 310294857200003
                <br />
                س.ت: 1010892742 | هاتف: 920012345
              </SubHeaderInfo>
            </HeaderSection>

            <DottedDivider />

            <MetaGrid>
              <MetaRow>
                <MetaLabel>رقم الفاتورة:</MetaLabel>
                <MetaValue>INV-{order.orderNumber.toString().padStart(6, '0')}</MetaValue>
              </MetaRow>
              <MetaRow>
                <MetaLabel>رقم الطلب:</MetaLabel>
                <MetaValue>#{order.orderNumber}</MetaValue>
              </MetaRow>
              <MetaRow>
                <MetaLabel>التاريخ والوقت:</MetaLabel>
                <MetaValue>
                  {formattedDate} — {formattedTime}
                </MetaValue>
              </MetaRow>
              <MetaRow>
                <MetaLabel>نوع الطلب:</MetaLabel>
                <MetaValue>{orderTypeArabic}</MetaValue>
              </MetaRow>
              <MetaRow>
                <MetaLabel>الكاشير:</MetaLabel>
                <MetaValue>{cashierName}</MetaValue>
              </MetaRow>
            </MetaGrid>

            <DottedDivider />

            <ItemsTable>
              <thead>
                <tr>
                  <th style={{ width: '45%' }}>الصنف</th>
                  <th style={{ textAlign: 'center', width: '15%' }}>الكمية</th>
                  <th style={{ textAlign: 'left', width: '20%' }}>السعر</th>
                  <th style={{ textAlign: 'left', width: '20%' }}>الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td>
                      <ItemTitle>{item.menuItemName}</ItemTitle>
                      {item.notes && <ItemSubnote>({item.notes})</ItemSubnote>}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.quantity}</td>
                    <td style={{ textAlign: 'left' }}>{item.unitPrice.toFixed(2)}</td>
                    <td style={{ textAlign: 'left', fontWeight: 700 }}>
                      {(item.unitPrice * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </ItemsTable>

            <DottedDivider />

            <CalculationSection>
              <CalcRow>
                <span>المجموع (غير شامل الضريبة):</span>
                <span>{subtotalBeforeVat.toFixed(2)} TL</span>
              </CalcRow>
              <CalcRow>
                <span>ضريبة القيمة المضافة (15%):</span>
                <span>{vatAmount.toFixed(2)} TL</span>
              </CalcRow>
              <CalcRow>
                <span>الخصم:</span>
                <span>0.00 TL</span>
              </CalcRow>
            </CalculationSection>

            <GrandTotalBox>
              <span>الإجمالي النهائي (شامل الضريبة):</span>
              <span className="price">{total.toFixed(2)} TL</span>
            </GrandTotalBox>

            <MetaRow style={{ fontSize: 11, color: '#64748B' }}>
              <span>طريقة الدفع: مدى / بطاقة بنكية</span>
              <span>حالة الدفع: مدفوع بالكامل</span>
            </MetaRow>

            <DoubleLineDivider />

            <QRContainer>
              <QRCode value={qrString} size={110} bordered={false} color="#0F172A" />

              <BarcodeSim>||||| | |||| ||| ||||||| |</BarcodeSim>
            </QRContainer>

            <FooterNote>
              شكراً لاختياركم مطعمنا! نتطلع لخدمتكم دائماً.
              <br />
              تابعونا على إنستغرام: @humhum
            </FooterNote>
          </ThermalPaper>
        </div>
      </PrintRoot>
    </>,
    document.body,
  );
}
