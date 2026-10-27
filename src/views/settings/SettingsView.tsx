'use client';

import React from 'react';
import styled from 'styled-components';
import { Button, Card, Space, Tag } from 'antd';
import {
  SettingOutlined,
  TeamOutlined,
  ShopOutlined,
  InfoCircleOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { PageHeader } from '@/components/common/PageHeader';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { UserRole } from '@/types';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const SettingsCard = styled(Card)`
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  overflow: hidden;

  .ant-card-body {
    padding: 0;
  }
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 18px 20px;
  }
`;

const CardLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconWrapper = styled.div<{ $color: string; $bg: string }>`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
  font-size: 24px;
  flex-shrink: 0;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #172033;
  margin: 0;
`;

const CardDesc = styled.p`
  font-size: 13px;
  color: #64748B;
  margin: 0;
`;

const ActionButton = styled(Button)`
  height: 38px;
  padding-inline: 18px;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

const InfoCard = styled.div`
  background: linear-gradient(135deg, #FFF7F3 0%, #FFFFFF 100%);
  border-radius: 16px;
  border: 1px solid #FFE4DC;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 4px 20px rgba(240, 100, 54, 0.05);

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 18px 20px;
  }
`;

const InfoIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: rgba(240, 100, 54, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F06436;
  font-size: 22px;
  flex-shrink: 0;
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoTitle = styled.span`
  font-weight: 700;
  color: #172033;
`;

const InfoDesc = styled.span`
  font-size: 13px;
  color: #64748B;
`;

export function SettingsView() {
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: UserRole })?.role;
  const isAdmin = userRole === 'ADMIN';

  return (
    <PageContainer>
      <PageHeader
        title="الإعدادات"
        subtitle="إدارة إعدادات النظام والمستخدمين وصلاحياتهم"
        badge={
          <Tag color="orange" icon={<SettingOutlined />}>
            الإعدادات
          </Tag>
        }
      />

      <Grid>
        {isAdmin && (
          <SettingsCard>
            <CardContent>
              <CardLeft>
                <IconWrapper $color="#2563EB" $bg="#EFF6FF">
                  <TeamOutlined />
                </IconWrapper>
                <TextGroup>
                  <CardTitle>إدارة المستخدمين</CardTitle>
                  <CardDesc>إضافة المستخدمين، تعديل الصلاحيات، وحذف الحسابات</CardDesc>
                </TextGroup>
              </CardLeft>
              <ActionButton
                type="primary"
                icon={<ArrowLeftOutlined rotate={180} />}
                style={{ backgroundColor: '#F06436', borderColor: '#F06436' }}
                onClick={() => router.push('/users')}
              >
                الذهاب إلى المستخدمين
              </ActionButton>
            </CardContent>
          </SettingsCard>
        )}

        <SettingsCard>
          <CardContent>
            <CardLeft>
              <IconWrapper $color="#16A34A" $bg="#F0FDF4">
                <ShopOutlined />
              </IconWrapper>
              <TextGroup>
                <CardTitle>معلومات المطعم</CardTitle>
                <CardDesc>اسم المطعم، الشعار، بيانات الاتصال والتواصل</CardDesc>
              </TextGroup>
            </CardLeft>
            <ActionButton disabled>قيد التطوير</ActionButton>
          </CardContent>
        </SettingsCard>
      </Grid>

      <InfoCard>
        <InfoIcon>
          <InfoCircleOutlined />
        </InfoIcon>
        <InfoText>
          <InfoTitle>نظام إدارة المطاعم</InfoTitle>
          <InfoDesc>
            يتم تطوير المزيد من إعدادات النظام تدريجياً. إدارة المستخدمين متاحة للمدير فقط.
          </InfoDesc>
        </InfoText>
      </InfoCard>
    </PageContainer>
  );
}
