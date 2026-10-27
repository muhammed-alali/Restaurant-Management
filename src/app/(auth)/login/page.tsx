"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import styled from "styled-components";
import {
  LockOutlined,
  UserOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ArrowLeftOutlined,
  CheckCircleFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Input, Form, message } from "antd";

const PageContainer = styled.main`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.appBackground};
  padding: 24px;
  direction: rtl;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 440px;
  background-color: ${({ theme }) => theme.colors.surfaceWhite};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const HeaderGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
`;

const LogoWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  background-color: ${({ theme }) => theme.colors.primaryOrange};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  box-shadow: 0 4px 12px rgba(240, 100, 54, 0.25);
`;

const SubtitleTag = styled.span`
  color: ${({ theme }) => theme.colors.primaryOrange};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const MainTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const RoleSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  background: ${({ theme }) => theme.colors.borderLight};
  padding: 4px;
  border-radius: 10px;
`;

const RoleButton = styled.button<{ $active: boolean }>`
  border: none;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.surfaceWhite : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primaryOrange : theme.colors.textSecondary};
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  font-size: 12px;
  padding: 8px 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ $active }) =>
    $active ? "0 2px 6px rgba(0,0,0,0.06)" : "none"};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryOrange};
  }
`;

const ErrorAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
`;

const FooterStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatusDot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #16a34a;
  }
`;

const demoAccounts = {
  admin: { username: "admin", password: "admin123", label: "المدير" },
  staff: { username: "staff01", password: "staff123", label: "كاشير" },
  chef: { username: "chef01", password: "chef123", label: "المطبخ" },
  delivery: { username: "delivery01", password: "delivery123", label: "توصيل" },
};

export default function LoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [activeRole, setActiveRole] = useState<
    "admin" | "staff" | "chef" | "delivery"
  >("admin");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [clock, setClock] = useState("");

  useEffect(() => {
    // Fill default credentials for admin
    form.setFieldsValue({
      username: demoAccounts.admin.username,
      password: demoAccounts.admin.password,
    });

    const updateClock = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, [form]);

  const handleRoleSelect = (
    roleKey: "admin" | "staff" | "chef" | "delivery",
  ) => {
    setActiveRole(roleKey);
    setErrorMsg(null);
    form.setFieldsValue({
      username: demoAccounts[roleKey].username,
      password: demoAccounts[roleKey].password,
    });
  };

  const handleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: values.username.trim(),
        password: values.password,
      });

      if (result?.error) {
        setErrorMsg("اسم المستخدم أو كلمة المرور غير صحيحة");
        setLoading(false);
      } else {
        message.success("تم تسجيل الدخول بنجاح");
        router.push("/orders");
        router.refresh();
      }
    } catch (err) {
      setErrorMsg("حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مرة أخرى");
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <LoginCard>
        <HeaderGroup>
          <LogoWrapper>
            <Image
              src="/images/logo/logo.jpg"
              alt="شعار مطعمنا"
              width={64}
              height={64}
              style={{ objectFit: "cover" }}
              priority
            />
          </LogoWrapper>
          <SubtitleTag>نظام إدارة الطلبات الداخلي</SubtitleTag>
          <MainTitle>مطعمنا — طعم لا يُنسى</MainTitle>
        </HeaderGroup>

        <div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#64748B",
              display: "block",
              marginBottom: 6,
            }}
          >
            تسجيل دخول سريع للتجربة:
          </span>
          <RoleSelector>
            <RoleButton
              type="button"
              $active={activeRole === "admin"}
              onClick={() => handleRoleSelect("admin")}
            >
              المدير
            </RoleButton>
            <RoleButton
              type="button"
              $active={activeRole === "staff"}
              onClick={() => handleRoleSelect("staff")}
            >
              الكاشير
            </RoleButton>
            <RoleButton
              type="button"
              $active={activeRole === "chef"}
              onClick={() => handleRoleSelect("chef")}
            >
              المطبخ
            </RoleButton>
            <RoleButton
              type="button"
              $active={activeRole === "delivery"}
              onClick={() => handleRoleSelect("delivery")}
            >
              التوصيل
            </RoleButton>
          </RoleSelector>
        </div>

        {errorMsg && (
          <ErrorAlert>
            <ExclamationCircleOutlined />
            <span>{errorMsg}</span>
          </ErrorAlert>
        )}

        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="اسم المستخدم"
            name="username"
            rules={[{ required: true, message: "يرجى إدخال اسم المستخدم" }]}
          >
            <Input
              size="large"
              prefix={<UserOutlined style={{ color: "#94A3B8" }} />}
              placeholder="مثال: admin"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            label="كلمة المرور"
            name="password"
            rules={[{ required: true, message: "يرجى إدخال كلمة المرور" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined style={{ color: "#94A3B8" }} />}
              placeholder="••••••••"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 8, marginTop: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              style={{
                height: 48,
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 15,
                backgroundColor: "#F06436",
                borderColor: "#F06436",
              }}
              icon={<ArrowLeftOutlined />}
            >
              دخول إلى النظام
            </Button>
          </Form.Item>
        </Form>

        <FooterStatus>
          <StatusDot>
            <span className="dot" />
            {/* <span>الخادم متصل (POS-Node-01)</span> */}
          </StatusDot>
          {/* <span>{clock}</span> */}
        </FooterStatus>
      </LoginCard>
    </PageContainer>
  );
}
