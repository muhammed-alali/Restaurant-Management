# 🐳 تشغيل المشروع باستخدام Docker

هذا الملف يشرح تشغيل نظام إدارة المطعم في وضعي **الإنتاج (Production)** و**التطوير (Development)**.

## المنافذ المستخدمة

| البيئة | منفذ المضيف (خارج الحاوية) | منفذ الحاوية الداخلي | الرابط |
|---|---|---|---|
| الإنتاج | `3010` | `3000` | http://localhost:3010 |
| التطوير | `3020` | `3000` | http://localhost:3020 |

> تم اختيار `3010` و`3020` بدلاً من `3000`/`3001` لتجنّب التعارض مع خوادم التطوير أو مشاريع أخرى قد تكون تعمل على الجهاز.

---

## 1) التشغيل الإنتاجي

### المتطلبات
- Docker Desktop (أو Docker Engine + Compose v2).
- ملف `.env.production` (موجود في المشروع، ومُستثنى من Git لأنه يحتوي أسراراً).

إذا لم يكن الملف موجوداً:

```powershell
Copy-Item .env.production.example .env.production
```

ثم أنشئ أسراراً جديدة وبدّلها داخل `.env.production`:

```bash
openssl rand -hex 32
```

### التشغيل

```powershell
npm run docker:prod:up
```

أو الأمر المكافئ:

```powershell
docker compose --env-file .env.production -f docker-compose.yml up -d --build
```

سيتم بالترتيب:
1. بناء صورة الإنتاج (Next.js standalone).
2. تشغيل خدمة `migrate` مرة واحدة لتطبيق ترحيلات Prisma (وسَتقوم بتعبئة البيانات التجريبية إذا كان `SEED_DB=true`).
3. تشغيل التطبيق بعد نجاح الترحيلات.

### التحقق

```powershell
npm run docker:prod:ps
npm run docker:prod:logs
```

- فحص الصحة: http://localhost:3010/api/health
- واجهة تسجيل الدخول: http://localhost:3010/login

### الإيقاف

```powershell
npm run docker:prod:down
```

### إعادة ضبط قاعدة البيانات (بداية نظيفة)

```powershell
npm run docker:prod:down
docker volume rm restaurant-management-prod-db
npm run docker:prod:up
```

---

## 2) التشغيل التطويري

```powershell
Copy-Item .env.example .env   # فقط إذا لم يكن ملف .env موجوداً
npm run docker:dev:up
```

- الرابط: http://localhost:3020
- يتم عمل Hot Reload من مجلد المشروع.
- يستخدم `prisma db push` لمزامنة قاعدة البيانات، ثم `seed` مرة واحدة.

للإيقاف:

```powershell
npm run docker:dev:down
```

---

## 3) تغيير المنافذ

كل شيء قابل للتغيير من ملف البيئة:

**الإنتاج** (`.env.production`):

```env
APP_PORT=3010
NEXTAUTH_URL=http://localhost:3010
```

**التطوير** (`.env` أو متغيرات البيئة):

```env
DEV_APP_PORT=3020
DEV_NEXTAUTH_URL=http://localhost:3020
```

بعد تغيير `APP_PORT` يجب أن يتغيّر `NEXTAUTH_URL` معه (نفس المنفذ)، ثم:

```powershell
npm run docker:prod:up
```

> مهم: استخدم دائماً سكربتات `npm run docker:*` لأنها تمرّر `--env-file .env.production`، وبذلك يُطبَّق المنفذ الجديد على ربط المنافذ في Docker Compose.

---

## 4) ملاحظات مهمة

- **`SEED_DB`**: اجعله `true` في أول نشر فقط لتعبئة بيانات الديمو، ثم بدّله إلى `false`. عملية التعبئة آمنة وقابلة للتكرار (لا تُنشئ تكرارات).
- **`AUTH_TRUST_HOST=true`**: مطلوب في الإنتاج، وإلا سيرفض Auth.js الطلبات برسالة `UntrustedHost`.
- **`NEXTAUTH_URL`**: يجب أن يطابق العنوان الذي يفتحه المستخدم فعلياً. على سيرفر حقيقي ضعه مثل `https://restaurant.example.com`.
- **قاعدة البيانات**: SQLite داخل Volume باسم `restaurant-management-prod-db`، فلا تُفقد البيانات عند إعادة بناء الحاوية.
- **الأسرار**: ملف `.env.production` غير مُتتبَّع في Git. لا ترفعه ولا تشاركه.

---

## 5) حل المشاكل الشائعة

### المنفذ مستخدم بالفعل
رسالة مثل `Bind for 0.0.0.0:3010 failed: port is already allocated` تعني أن منفذاً آخر يستخدمه. غيّر `APP_PORT` و`NEXTAUTH_URL` ثم أعد التشغيل. ولمعرفة المستخدم للمنفذ:

```powershell
Get-NetTCPConnection -LocalPort 3010 -State Listen
```

### حاوية قديمة بنفس الاسم
إذا وُجدت حاويات من محاولة سابقة:

```powershell
docker ps -a --filter "name=restaurant-management"
docker rm -f <container-name>
```

أو احذف كل شيء يخص المشروع ثم أعد التشغيل:

```powershell
docker compose --env-file .env.production -f docker-compose.yml down --remove-orphans
```

### فشل الترحيلات بسبب قاعدة بيانات قديمة
إذا كان الـ Volume يحتوي قاعدة بيانات قديمة غير متوافقة، أعد ضبطه كما في خطوة «إعادة ضبط قاعدة البيانات».

### بناء كامل من جديد بدون كاش

```powershell
docker compose --env-file .env.production -f docker-compose.yml build --no-cache
npm run docker:prod:up
```
