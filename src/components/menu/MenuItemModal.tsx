'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch, Button } from 'antd';
import type { MenuItem, MenuCategory } from '@/types';

interface MenuItemModalProps {
  open: boolean;
  item: MenuItem | null;
  categories: MenuCategory[];
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    image?: string;
    isAvailable?: boolean;
  }) => Promise<boolean>;
}

const foodImageOptions = [
  { label: 'برغر كلاسيك', value: '/images/food/burger_classic.svg' },
  { label: 'برغر بالجبنة', value: '/images/food/burger_cheese.svg' },
  { label: 'بيتزا مارجريتا', value: '/images/food/pizza_margherita.svg' },
  { label: 'بيتزا خضار', value: '/images/food/pizza_veggie.svg' },
  { label: 'شاورما دجاج', value: '/images/food/shawarma_chicken.svg' },
  { label: 'دجاج مشوي', value: '/images/food/grilled_chicken.svg' },
  { label: 'أجنحة دجاج', value: '/images/food/chicken_wings.svg' },
  { label: 'سلطة خضراء', value: '/images/food/green_salad.svg' },
  { label: 'سلطة سيزر', value: '/images/food/caesar_salad.svg' },
  { label: 'عصير برتقال', value: '/images/food/orange_juice.svg' },
  { label: 'كولا باردة', value: '/images/food/cola.svg' },
  { label: 'بطاطا مقلية', value: '/images/food/french_fries.svg' },
  { label: 'باستا ألفريدو', value: '/images/food/pasta_alfredo.svg' },
];

export function MenuItemModal({
  open,
  item,
  categories,
  onClose,
  onSubmit,
}: MenuItemModalProps) {
  const [form] = Form.useForm();
  const isEdit = Boolean(item);

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: item.categoryId,
        image: item.image || foodImageOptions[0].value,
        isAvailable: item.isAvailable,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        price: 50,
        categoryId: categories[0]?.id,
        image: foodImageOptions[0].value,
        isAvailable: true,
      });
    }
  }, [item, categories, form]);

  const handleFinish = async (values: {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    image?: string;
    isAvailable?: boolean;
  }) => {
    const success = await onSubmit(values);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      title={
        <span style={{ fontWeight: 700, fontSize: 18 }}>
          {isEdit ? 'تعديل الصنف' : 'إضافة صنف جديد للمنيو'}
        </span>
      }
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} style={{ marginTop: 16 }}>
        <Form.Item
          name="name"
          label="اسم الصنف"
          rules={[{ required: true, message: 'يرجى إدخال اسم الصنف' }]}
        >
          <Input placeholder="مثال: برغر دجاج مشوي" />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="التصنيف"
          rules={[{ required: true, message: 'يرجى اختيار التصنيف' }]}
        >
          <Select placeholder="اختر التصنيف">
            {categories.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="price"
          label="السعر (ر.س)"
          rules={[{ required: true, message: 'يرجى تحديد السعر' }]}
        >
          <InputNumber min={1} max={1000} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="description" label="الوصف والمكونات">
          <Input.TextArea rows={2} placeholder="وصف موجز للمكونات والطعم..." />
        </Form.Item>

        <Form.Item name="image" label="الصورة">
          <Select placeholder="اختر صورة الصنف">
            {foodImageOptions.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="isAvailable" label="حالة التوفر" valuePropName="checked">
          <Switch checkedChildren="متاح" unCheckedChildren="غير متوفر" />
        </Form.Item>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <Button onClick={onClose}>إلغاء</Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: '#F06436', borderColor: '#F06436' }}
          >
            {isEdit ? 'حفظ التعديلات' : 'إضافة الصنف'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
