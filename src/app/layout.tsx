import type { Metadata } from 'next';
import './globals.css';
import LoadingLayout from './LoadingLayout';

export const metadata: Metadata = {
  title: 'HumHum — نظام إدارة المطعم',
  description: 'نظام إدارة المطاعم المتكامل للموظفين والمطبخ وإدارة الطلبات',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <LoadingLayout>{children}</LoadingLayout>
      </body>
    </html>
  );
}
