'use client';

import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { Modal, Button, Radio, Space, QRCode } from 'antd';
import {
  PrinterOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import type { Order } from '@/types';

interface ReceiptModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  cashierName?: string;
}

// ─── Modal Styles & Print Container ─────────────────────────────────

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #F8FAFC;
  padding: 16px;
  border-radius: 12px;
  max-height: 75vh;
  overflow-y: auto;
`;

const ControlsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
`;

// ─── Thermal POS Receipt (80mm) Styling ─────────────────────────────

const ThermalPaper = styled.div`
  width: 340px;
  background: #FFFFFF;
  padding: 24px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #E2E8F0;
  font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
  color: #1E293B;
  font-size: 13px;
  line-height: 1.4;
  position: relative;
  direction: rtl;

  /* Zigzag edge on top & bottom for realism */
  &::before, &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 6px;
    background-size: 12px 6px;
  }
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

// ─── Standard A4 Tax Invoice Layout ─────────────────────────────────

const A4Paper = styled.div`
  width: 580px;
  background: #FFFFFF;
  padding: 36px 32px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #E2E8F0;
  font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
  color: #1E293B;
  font-size: 13px;
  direction: rtl;
`;

const A4Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  border-bottom: 2px solid #F06436;
  padding-bottom: 16px;
`;

const A4Company = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const A4InvoiceTitle = styled.div`
  text-align: left;
  h1 {
    font-size: 20px;
    color: #F06436;
    margin: 0;
    font-weight: 800;
  }
  p {
    margin: 4px 0 0 0;
    font-size: 12px;
    color: #64748B;
  }
`;

// ─── Component Implementation ───────────────────────────────────────

export function ReceiptModal({
  order,
  open,
  onClose,
  cashierName = 'أحمد محمد',
}: ReceiptModalProps) {
  const [layoutMode, setLayoutMode] = useState<'thermal' | 'a4'>('thermal');
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!order) return null;

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* ── Global Print Media CSS ── */}
      <style jsx global>{`
        @media print {
          /* Hide all page chrome, modals backdrop, sidebar, headers */
          body * {
            visibility: hidden !important;
          }
          #printable-invoice-content,
          #printable-invoice-content * {
            visibility: visible !important;
          }
          #printable-invoice-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 10px !important;
            box-shadow: none !important;
            border: none !important;
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

      <Modal
        open={open}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PrinterOutlined style={{ color: '#F06436', fontSize: 20 }} />
            <span style={{ fontWeight: 700, fontSize: 17 }}>
              طباعة الفاتورة — طلب #{order.orderNumber}
            </span>
          </div>
        }
        onCancel={onClose}
        width={680}
        centered
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button onClick={onClose} icon={<CloseOutlined />}>
              إغلاق
            </Button>
            <Space>
              <Button
                type="primary"
                icon={<PrinterOutlined />}
                onClick={handlePrint}
                style={{
                  backgroundColor: '#F06436',
                  borderColor: '#F06436',
                  fontWeight: 600,
                  height: 40,
                  paddingInline: 24,
                }}
              >
                طباعة الفاتورة الآن
              </Button>
            </Space>
          </div>
        }
      >
        <ControlsBar className="no-print">
          <Radio.Group
            value={layoutMode}
            onChange={(e) => setLayoutMode(e.target.value)}
            buttonStyle="solid"
            size="middle"
          >
            <Radio.Button value="thermal">إيصال كاشير حراري (80mm)</Radio.Button>
            <Radio.Button value="a4">فاتورة ضريبية رسمية (A4)</Radio.Button>
          </Radio.Group>
          <span style={{ fontSize: 12, color: '#64748B' }}>
            جاهزة للإرسال مباشرة إلى طابعة الكاشير أو الطابعة العادية
          </span>
        </ControlsBar>

        <ModalContentWrapper>
          <div id="printable-invoice-content" ref={printAreaRef}>
            {layoutMode === 'thermal' ? (
              /* ─── THERMAL RECEIPT 80MM ─── */
              <ThermalPaper>
                <HeaderSection>
                  <LogoBox>
                    <Image
                      src="/images/logo/logo.jpg"
                      alt="HumHum"
                      width={52}
                      height={52}
                      style={{ objectFit: 'cover' }}
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
                  <QRCode
                    value={qrString}
                    size={110}
                    bordered={false}
                    color="#0F172A"
                  />

                  <BarcodeSim>||||| | |||| ||| ||||||| |</BarcodeSim>
                </QRContainer>

                <FooterNote>
                  شكراً لاختياركم مطعمنا! نتطلع لخدمتكم دائماً.
                  <br />
                  تابعونا على إنستغرام: @humhum
                </FooterNote>
              </ThermalPaper>
            ) : (
              /* ─── A4 OFFICIAL TAX INVOICE ─── */
              <A4Paper>
                <A4Header>
                  <A4Company>
                    <LogoBox style={{ width: 64, height: 64 }}>
                      <Image
                        src="/images/logo/logo.jpg"
                        alt="مطعمنا"
                        width={64}
                        height={64}
                        style={{ objectFit: 'cover' }}
                      />
                    </LogoBox>
                    <div>
                      <RestaurantName style={{ fontSize: 22 }}>مطعمنا</RestaurantName>
                      <Tagline style={{ fontSize: 13 }}>طعم لا يُنسى — لخدمات الأطعمة والضيافة</Tagline>
                      <div style={{ fontSize: 11, color: '#64748B' }}>
                        الرقم الضريبي: 310294857200003 | س.ت: 1010892742
                        <br />
                        إسطنبول، تركيا

                      </div>
                    </div>
                  </A4Company>


                  <A4InvoiceTitle>
                    <h1>فاتورة ضريبية مبسطة</h1>
                    <p>Simplified Tax Invoice</p>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', marginTop: 4 }}>
                      INV-{order.orderNumber.toString().padStart(6, '0')}
                    </div>
                  </A4InvoiceTitle>
                </A4Header>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                    padding: '12px 16px',
                    background: '#F8FAFC',
                    borderRadius: 8,
                    marginBottom: 20,
                  }}
                >
                  <MetaGrid>
                    <MetaRow>
                      <MetaLabel>رقم الطلب:</MetaLabel>
                      <MetaValue>#{order.orderNumber}</MetaValue>
                    </MetaRow>
                    <MetaRow>
                      <MetaLabel>تاريخ الإصدار:</MetaLabel>
                      <MetaValue>{formattedDate}</MetaValue>
                    </MetaRow>
                    <MetaRow>
                      <MetaLabel>وقت الإصدار:</MetaLabel>
                      <MetaValue>{formattedTime}</MetaValue>
                    </MetaRow>
                  </MetaGrid>

                  <MetaGrid>
                    <MetaRow>
                      <MetaLabel>نوع الخدمة:</MetaLabel>
                      <MetaValue>{orderTypeArabic}</MetaValue>
                    </MetaRow>
                    <MetaRow>
                      <MetaLabel>الموظف المسؤول:</MetaLabel>
                      <MetaValue>{cashierName}</MetaValue>
                    </MetaRow>
                    <MetaRow>
                      <MetaLabel>حالة السداد:</MetaLabel>
                      <MetaValue style={{ color: '#16A34A' }}>
                        <CheckCircleOutlined style={{ marginInlineEnd: 4 }} />
                        مسدد بالكامل
                      </MetaValue>
                    </MetaRow>
                  </MetaGrid>
                </div>

                <ItemsTable style={{ fontSize: 13, marginBottom: 20 }}>
                  <thead>
                    <tr style={{ background: '#F1F5F9' }}>
                      <th style={{ padding: '8px 12px' }}>م</th>
                      <th style={{ padding: '8px 12px' }}>اسم الصنف والوصف</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center' }}>الكمية</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>سعر الوحدة</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={item.id || idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 12px', color: '#64748B' }}>{idx + 1}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <ItemTitle style={{ fontSize: 14 }}>{item.menuItemName}</ItemTitle>
                          {item.notes && <ItemSubnote>ملاحظات: {item.notes}</ItemSubnote>}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>
                          {item.quantity}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'left' }}>
                          {item.unitPrice.toFixed(2)} TL
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700 }}>
                          {(item.unitPrice * item.quantity).toFixed(2)} TL
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </ItemsTable>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 24,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <QRCode value={qrString} size={110} bordered color="#0F172A" />


                  </div>

                  <div style={{ width: 260 }}>
                    <CalculationSection style={{ fontSize: 13 }}>
                      <CalcRow>
                        <span>المبلغ الخاضع للضريبة:</span>
                        <span>{subtotalBeforeVat.toFixed(2)} TL</span>
                      </CalcRow>
                      <CalcRow>
                        <span>ضريبة القيمة المضافة (15%):</span>
                        <span>{vatAmount.toFixed(2)} TL</span>
                      </CalcRow>
                    </CalculationSection>

                    <GrandTotalBox style={{ marginTop: 8, padding: '14px 16px' }}>
                      <span>الإجمالي المستحق:</span>
                      <span className="price" style={{ fontSize: 20 }}>
                        {total.toFixed(2)} TL
                      </span>
                    </GrandTotalBox>
                  </div>
                </div>

                <DoubleLineDivider style={{ marginTop: 24 }} />

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 11,
                    color: '#64748B',
                    paddingTop: 8,
                  }}
                >
                  <span>شكراً لتعاملكم معنا، نأمل أن تكون وجبتكم نالت إعجابكم!</span>
                  <span>الرقم الموحد: 920012345 | info@humhum.com</span>
                </div>
              </A4Paper>
            )}
          </div>
        </ModalContentWrapper>
      </Modal>
    </>
  );
}
