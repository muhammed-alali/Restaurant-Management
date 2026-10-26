"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import { Modal, Button, Tag, Input, Select, Radio, App, Divider } from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  SendOutlined,
  ShopOutlined,
  CarOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import type { OrderType, MenuItem, RestaurantTable } from "@/types";

interface NewOrderModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: OrderType;
    tableId?: string;
    notes?: string;
    items: { menuItemId: string; quantity: number; notes?: string }[];
    delivery?: {
      recipientName: string;
      phone: string;
      address: string;
      bikeNumber?: number;
    };
  }) => Promise<boolean>;
  menuItems: MenuItem[];
  tables: RestaurantTable[];
  initialTableId?: string;
  initialType?: OrderType;
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes: string;
}

const PosModalContainer = styled.div`
  display: flex;
  gap: 20px;
  height: 600px;
  overflow: hidden;

  @media (max-width: 900px) {
    flex-direction: column;
    height: 75vh;
    overflow-y: auto;
  }
`;

const MenuCatalogSection = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-left: 1px solid #e2e8f0;
  padding-left: 16px;

  @media (max-width: 900px) {
    border-left: none;
    padding-left: 0;
    overflow: visible;
  }
`;

const CategoriesPillsBar = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 12px;
  flex-shrink: 0;

  &::-webkit-scrollbar {
    height: 4px;
  }
`;

const CategoryPill = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primaryOrange : "#F1F5F9"};
  color: ${({ $active }) => ($active ? "#FFFFFF" : "#475569")};

  &:hover {
    background-color: ${({ $active, theme }) =>
      $active ? theme.colors.primaryOrange : "#E2E8F0"};
  }
`;

const FoodItemsGrid = styled.div`
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  padding-right: 4px;
  height: min-content;

  padding-bottom: 12px;
`;

const FoodItemTouchCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  height: min-content;

  flex-direction: column;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.06);
    border-color: ${({ theme }) => theme.colors.primaryOrange};
  }

  &:active {
    transform: scale(0.97);
  }
`;

const FoodImageWrap = styled.div`
  width: 100%;
  height: 90px;
  position: relative;
  background: #fff7ed;
`;

const FoodCardContent = styled.div`
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FoodName = styled.span`
  font-weight: 700;
  font-size: 13px;
  color: #172033;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FoodPrice = styled.span`
  font-weight: 800;
  font-size: 14px;
  color: #f06436;
`;

const CartOrderPanel = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 280px;

  @media (max-width: 900px) {
    min-width: 100%;
    overflow: visible;
  }
`;

const OrderHeaderConfig = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
`;

const CartItemsList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
`;

const CartItemRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 10px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const CartItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuantityBtn = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
  }
`;

const CartFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
`;

const TotalTextRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 800;
  color: #172033;

  .amount {
    color: #f06436;
    font-size: 20px;
  }
`;

export function NewOrderModal({
  open,
  onClose,
  onSubmit,
  menuItems,
  tables,
  initialTableId,
  initialType = "DINE_IN",
}: NewOrderModalProps) {
  const [orderType, setOrderType] = useState<OrderType>(initialType);
  const [selectedTableId, setSelectedTableId] = useState<string | undefined>(
    initialTableId,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [generalNotes, setGeneralNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delivery fields
  const { message } = App.useApp();
  const [deliveryName, setDeliveryName] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [bikeNumber, setBikeNumber] = useState<number>(1);

  useEffect(() => {
    if (open) {
      if (initialTableId) {
        setSelectedTableId(initialTableId);
        setOrderType("DINE_IN");
      } else {
        setOrderType(initialType);
      }
      setCart([]);
      setGeneralNotes("");
    }
  }, [open, initialTableId, initialType]);

  const availableItems = menuItems.filter((i) => i.isAvailable);
  const categories = Array.from(
    new Set(menuItems.map((i) => i.category?.name || "أخرى")),
  );

  const filteredItems =
    selectedCategory === "ALL"
      ? availableItems
      : availableItems.filter(
          (i) => (i.category?.name || "أخرى") === selectedCategory,
        );

  const handleAddToCart = (item: MenuItem) => {
    const existingIndex = cart.findIndex((c) => c.menuItem.id === item.id);
    if (existingIndex >= 0) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { menuItem: item, quantity: 1, notes: "" }]);
    }
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.menuItem.id === itemId) {
            return { ...c, quantity: c.quantity + delta };
          }
          return c;
        })
        .filter((c) => c.quantity > 0),
    );
  };

  const handleItemNoteChange = (itemId: string, note: string) => {
    setCart((prev) =>
      prev.map((c) => (c.menuItem.id === itemId ? { ...c, notes: note } : c)),
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItem.id !== itemId));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0);
  };

  const handleSubmit = async () => {
    if (cart.length === 0) {
      message.error("يرجى إضافة صنف واحد على الأقل إلى السلة");
      return;
    }

    if (orderType === "DINE_IN" && !selectedTableId) {
      message.error("يرجى اختيار الطاولة");
      return;
    }

    if (orderType === "DELIVERY") {
      if (!deliveryName || !deliveryPhone || !deliveryAddress) {
        message.error("يرجى ملء بيانات العميل وموقع التوصيل");
        return;
      }
    }

    setSubmitting(true);
    const success = await onSubmit({
      type: orderType,
      tableId: orderType === "DINE_IN" ? selectedTableId : undefined,
      notes: generalNotes || undefined,
      items: cart.map((c) => ({
        menuItemId: c.menuItem.id,
        quantity: c.quantity,
        notes: c.notes || undefined,
      })),
      delivery:
        orderType === "DELIVERY"
          ? {
              recipientName: deliveryName,
              phone: deliveryPhone,
              address: deliveryAddress,
              bikeNumber: bikeNumber,
            }
          : undefined,
    });
    setSubmitting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          <span>تسجيل طلب جديد</span>
        </div>
      }
      onCancel={onClose}
      footer={null}
      width={1000}
      centered
      destroyOnHidden
    >
      <PosModalContainer>
        {/* Left catalog section */}
        <MenuCatalogSection>
          <CategoriesPillsBar>
            <CategoryPill
              $active={selectedCategory === "ALL"}
              onClick={() => setSelectedCategory("ALL")}
            >
              الكل ({availableItems.length})
            </CategoryPill>
            {categories.map((cat) => (
              <CategoryPill
                key={cat}
                $active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </CategoryPill>
            ))}
          </CategoriesPillsBar>

          <FoodItemsGrid>
            {filteredItems.map((item) => (
              <FoodItemTouchCard
                key={item.id}
                onClick={() => handleAddToCart(item)}
              >
                <FoodImageWrap>
                  <Image
                    src={item.image || "/images/food/burger_classic.svg"}
                    alt={item.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="140px"
                  />
                </FoodImageWrap>
                <FoodCardContent>
                  <FoodName title={item.name}>{item.name}</FoodName>
                  <FoodPrice>{item.price} TL</FoodPrice>
                </FoodCardContent>
              </FoodItemTouchCard>
            ))}
          </FoodItemsGrid>
        </MenuCatalogSection>

        {/* Right cart section */}
        <CartOrderPanel>
          <OrderHeaderConfig>
            <Radio.Group
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              buttonStyle="solid"
              style={{ width: "100%", display: "flex" }}
            >
              <Radio.Button
                value="DINE_IN"
                style={{ flex: 1, textAlign: "center" }}
              >
                <ShopOutlined /> صالة
              </Radio.Button>
              <Radio.Button
                value="TAKEAWAY"
                style={{ flex: 1, textAlign: "center" }}
              >
                <ShoppingOutlined /> سفري
              </Radio.Button>
              <Radio.Button
                value="DELIVERY"
                style={{ flex: 1, textAlign: "center" }}
              >
                <CarOutlined /> توصيل
              </Radio.Button>
            </Radio.Group>

            {orderType === "DINE_IN" && (
              <Select
                placeholder="اختر الطاولة"
                value={selectedTableId}
                onChange={setSelectedTableId}
                style={{ width: "100%" }}
              >
                {tables.map((t) => (
                  <Select.Option
                    key={t.id}
                    value={t.id}
                    disabled={
                      t.status === "OCCUPIED" && t.id !== initialTableId
                    }
                  >
                    طاولة {t.number} (
                    {t.status === "AVAILABLE" ? "متاحة" : "بانتظار الطعام"})
                  </Select.Option>
                ))}
              </Select>
            )}

            {orderType === "DELIVERY" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <Input
                    placeholder="اسم العميل"
                    value={deliveryName}
                    onChange={(e) => setDeliveryName(e.target.value)}
                    style={{ flex: 2 }}
                  />
                  <Select
                    value={bikeNumber}
                    onChange={setBikeNumber}
                    style={{ flex: 1 }}
                  >
                    <Select.Option value={1}>موتور 1</Select.Option>
                    <Select.Option value={2}>موتور 2</Select.Option>
                    <Select.Option value={3}>موتور 3</Select.Option>
                    <Select.Option value={4}>موتور 4</Select.Option>
                  </Select>
                </div>
                <Input
                  placeholder="رقم الهاتف (الواتساب)"
                  value={deliveryPhone}
                  onChange={(e) => setDeliveryPhone(e.target.value)}
                />
                <Input
                  placeholder="عنوان التوصيل"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>
            )}
          </OrderHeaderConfig>

          <CartItemsList>
            {cart.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px 10px",
                  color: "#94A3B8",
                  fontSize: "13px",
                }}
              >
                السلة فارغة. انقر على أي وجبة لإضافتها فوراً.
              </div>
            ) : (
              cart.map((c) => (
                <CartItemRow key={c.menuItem.id}>
                  <CartItemTop>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: "#172033",
                      }}
                    >
                      {c.menuItem.name}
                    </span>
                    <CartItemActions>
                      <QuantityBtn
                        onClick={() => handleQuantityChange(c.menuItem.id, -1)}
                      >
                        <MinusOutlined />
                      </QuantityBtn>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          minWidth: 18,
                          textAlign: "center",
                        }}
                      >
                        {c.quantity}
                      </span>
                      <QuantityBtn
                        onClick={() => handleQuantityChange(c.menuItem.id, 1)}
                      >
                        <PlusOutlined />
                      </QuantityBtn>
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#F06436",
                          marginRight: 4,
                        }}
                      >
                        {(c.menuItem.price * c.quantity).toFixed(0)} TL
                      </span>
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveFromCart(c.menuItem.id)}
                      />
                    </CartItemActions>
                  </CartItemTop>
                  <Input
                    size="small"
                    placeholder="ملاحظة خاصة (مثال: بدون بصل / حار)"
                    value={c.notes}
                    onChange={(e) =>
                      handleItemNoteChange(c.menuItem.id, e.target.value)
                    }
                  />
                </CartItemRow>
              ))
            )}
          </CartItemsList>

          <CartFooter>
            <Input
              placeholder="ملاحظات عامة على الطلب..."
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
            />

            <TotalTextRow>
              <span>الإجمالي:</span>
              <span className="amount">{calculateTotal().toFixed(2)} TL</span>
            </TotalTextRow>

            <Button
              type="primary"
              size="large"
              icon={<SendOutlined />}
              loading={submitting}
              onClick={handleSubmit}
              style={{
                height: "48px",
                fontSize: "16px",
                fontWeight: 700,
                backgroundColor: "#F06436",
                borderColor: "#F06436",
              }}
            >
              إرسال الطلب للمطبخ 👨‍🍳🔥
            </Button>
          </CartFooter>
        </CartOrderPanel>
      </PosModalContainer>
    </Modal>
  );
}
