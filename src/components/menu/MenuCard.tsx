'use client';

import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { Switch, Button, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { MenuItem } from '@/types';

interface MenuCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onToggleAvailability: (item: MenuItem) => void;
}

const CardWrapper = styled.div<{ $available: boolean }>`
  background-color: #FFFFFF;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  opacity: ${({ $available }) => ($available ? '1' : '0.6')};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 160px;
  position: relative;
  background-color: #F8FAFC;
  overflow: hidden;
`;

const CardContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
`;

const TitlePriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ItemName = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #172033;
  margin: 0;
`;

const PriceTag = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #F06436;
`;

const Description = styled.p`
  font-size: 13px;
  color: #64748B;
  margin: 0;
  line-height: 1.4;
  flex: 1;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #F1F5F9;
  margin-top: 4px;
`;

const SwitchGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748B;
`;

export function MenuCard({ item, onEdit, onToggleAvailability }: MenuCardProps) {
  const [imgError, setImgError] = React.useState(false);
  const imageSrc = !imgError && item.image ? item.image : '/images/food/burger_classic.svg';

  return (
    <CardWrapper $available={item.isAvailable}>
      <ImageContainer>
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 300px"
          onError={() => setImgError(true)}
        />
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <Tag color={item.isAvailable ? 'green' : 'default'}>
            {item.category?.name || 'صنف'}
          </Tag>
        </div>
      </ImageContainer>

      <CardContent>
        <TitlePriceRow>
          <ItemName>{item.name}</ItemName>
          <PriceTag>{item.price} ر.س</PriceTag>
        </TitlePriceRow>

        <Description>{item.description || 'وجبة طازجة وشهية'}</Description>

        <CardFooter>
          <SwitchGroup>
            <Switch
              size="small"
              checked={item.isAvailable}
              onChange={() => onToggleAvailability(item)}
            />
            <span>{item.isAvailable ? 'متاح للطلب' : 'غير متوفر'}</span>
          </SwitchGroup>

          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(item)}
          >
            تعديل
          </Button>
        </CardFooter>
      </CardContent>
    </CardWrapper>
  );
}
