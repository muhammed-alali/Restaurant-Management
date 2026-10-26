import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ── Users ──────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 12);
  const staffPassword = await bcrypt.hash('staff123', 12);
  const chefPassword = await bcrypt.hash('chef123', 12);
  const deliveryPassword = await bcrypt.hash('delivery123', 12);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { name: 'أحمد محمد', username: 'admin', password: adminPassword, role: 'ADMIN' },
  });

  await prisma.user.upsert({
    where: { username: 'staff01' },
    update: {},
    create: { name: 'سارة عبدالله', username: 'staff01', password: staffPassword, role: 'STAFF' },
  });

  const chef = await prisma.user.upsert({
    where: { username: 'chef01' },
    update: {},
    create: { name: 'محمد العلي', username: 'chef01', password: chefPassword, role: 'CHEF' },
  });

  await prisma.user.upsert({
    where: { username: 'delivery01' },
    update: {},
    create: { name: 'خالد الأحمد', username: 'delivery01', password: deliveryPassword, role: 'DELIVERY_STAFF' },
  });

  console.log('✅ Users created');

  // ── Menu Categories ────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.menuCategory.upsert({ where: { name: 'برغر' }, update: {}, create: { name: 'برغر' } }),
    prisma.menuCategory.upsert({ where: { name: 'بيتزا' }, update: {}, create: { name: 'بيتزا' } }),
    prisma.menuCategory.upsert({ where: { name: 'مشاوي' }, update: {}, create: { name: 'مشاوي' } }),
    prisma.menuCategory.upsert({ where: { name: 'سلطات' }, update: {}, create: { name: 'سلطات' } }),
    prisma.menuCategory.upsert({ where: { name: 'مشروبات' }, update: {}, create: { name: 'مشروبات' } }),
    prisma.menuCategory.upsert({ where: { name: 'مقبلات' }, update: {}, create: { name: 'مقبلات' } }),
  ]);

  const [catBurger, catPizza, catGrill, catSalad, catDrinks, catSides] = categories;

  console.log('✅ Menu categories created');

  // ── Menu Items ─────────────────────────────────────────────────
  const menuItems = [
    { name: 'برغر كلاسيك', description: 'برغر لحم بقري مع جبنة وخس وطماطم', price: 120, image: '/images/food/burger_classic.svg', isAvailable: true, categoryId: catBurger.id },
    { name: 'برغر بالجبنة', description: 'برغر مزدوج مع جبنة شيدر مذابة', price: 140, image: '/images/food/burger_cheese.svg', isAvailable: true, categoryId: catBurger.id },
    { name: 'بيتزا مارجريتا', description: 'بيتزا بصوص الطماطم والجبنة الطازجة', price: 180, image: '/images/food/pizza_margherita.svg', isAvailable: true, categoryId: catPizza.id },
    { name: 'بيتزا خضار', description: 'بيتزا بالخضار الطازجة والجبن', price: 160, image: '/images/food/pizza_veggie.svg', isAvailable: true, categoryId: catPizza.id },
    { name: 'شاورما دجاج', description: 'شاورما دجاج مع الثوم والخضار', price: 150, image: '/images/food/shawarma_chicken.svg', isAvailable: true, categoryId: catGrill.id },
    { name: 'دجاج مشوي', description: 'دجاج مشوي متبّل بالأعشاب والبهارات', price: 160, image: '/images/food/grilled_chicken.svg', isAvailable: true, categoryId: catGrill.id },
    { name: 'أجنحة دجاج', description: 'أجنحة دجاج مقلية مع صوص بافالو', price: 110, image: '/images/food/chicken_wings.svg', isAvailable: false, categoryId: catGrill.id },
    { name: 'سلطة خضراء', description: 'خضار طازجة مع زيت الزيتون والليمون', price: 90, image: '/images/food/green_salad.svg', isAvailable: true, categoryId: catSalad.id },
    { name: 'سلطة سيزر', description: 'خس روماني مع صوص سيزر والجبن', price: 100, image: '/images/food/caesar_salad.svg', isAvailable: true, categoryId: catSalad.id },
    { name: 'عصير برتقال', description: 'عصير برتقال طازج معصور', price: 60, image: '/images/food/orange_juice.svg', isAvailable: true, categoryId: catDrinks.id },
    { name: 'كولا', description: 'مشروب غازي بارد', price: 25, image: '/images/food/cola.svg', isAvailable: true, categoryId: catDrinks.id },
    { name: 'بطاطا مقلية', description: 'بطاطا مقرمشة مع كاتشب', price: 70, image: '/images/food/french_fries.svg', isAvailable: true, categoryId: catSides.id },
    { name: 'باستا ألفريدو', description: 'باستا كريمية بصوص ألفريدو والجبن', price: 130, image: '/images/food/pasta_alfredo.svg', isAvailable: true, categoryId: catSides.id },
  ];

  for (const item of menuItems) {
    const existing = await prisma.menuItem.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.menuItem.create({ data: item });
    }
  }

  console.log('✅ Menu items created');

  // ── Restaurant Tables ──────────────────────────────────────────
  for (let i = 1; i <= 16; i++) {
    const capacity = i <= 4 ? 4 : i <= 8 ? 6 : i <= 12 ? 2 : 4;
    await prisma.restaurantTable.upsert({
      where: { number: i },
      update: {},
      create: { number: i, capacity, status: 'AVAILABLE' },
    });
  }

  console.log('✅ Tables created (1-16)');

  // ── Sample Orders ──────────────────────────────────────────────
  // Get some tables and menu items for sample orders
  const table4 = await prisma.restaurantTable.findUnique({ where: { number: 4 } });
  const table7 = await prisma.restaurantTable.findUnique({ where: { number: 7 } });
  const burger = await prisma.menuItem.findFirst({ where: { name: 'برغر كلاسيك' } });
  const fries = await prisma.menuItem.findFirst({ where: { name: 'بطاطا مقلية' } });
  const pizza = await prisma.menuItem.findFirst({ where: { name: 'بيتزا مارجريتا' } });
  const juice = await prisma.menuItem.findFirst({ where: { name: 'عصير برتقال' } });
  const shawarma = await prisma.menuItem.findFirst({ where: { name: 'شاورما دجاج' } });

  if (burger && fries && pizza && juice && shawarma && table4 && table7) {
    const existingOrders = await prisma.order.count();

    if (existingOrders === 0) {
      // Order 1 - READY on table 4
      await prisma.order.create({
        data: {
          orderNumber: 101,
          type: 'DINE_IN',
          status: 'READY',
          tableId: table4.id,
          total: burger.price * 2 + fries.price,
          items: {
            create: [
              { menuItemId: burger.id, menuItemName: burger.name, unitPrice: burger.price, quantity: 2 },
              { menuItemId: fries.id, menuItemName: fries.name, unitPrice: fries.price, quantity: 1 },
            ],
          },
        },
      });

      await prisma.restaurantTable.update({ where: { id: table4.id }, data: { status: 'OCCUPIED' } });

      // Order 2 - PREPARING on table 7
      await prisma.order.create({
        data: {
          orderNumber: 102,
          type: 'DINE_IN',
          status: 'PREPARING',
          tableId: table7.id,
          notes: 'بدون بصل',
          total: pizza.price + juice.price,
          items: {
            create: [
              { menuItemId: pizza.id, menuItemName: pizza.name, unitPrice: pizza.price, quantity: 1 },
              { menuItemId: juice.id, menuItemName: juice.name, unitPrice: juice.price, quantity: 1 },
            ],
          },
        },
      });

      await prisma.restaurantTable.update({ where: { id: table7.id }, data: { status: 'OCCUPIED' } });

      // Order 3 - NEW (Takeaway)
      await prisma.order.create({
        data: {
          orderNumber: 103,
          type: 'TAKEAWAY',
          status: 'NEW',
          total: shawarma.price * 2,
          items: {
            create: [
              { menuItemId: shawarma.id, menuItemName: shawarma.name, unitPrice: shawarma.price, quantity: 2 },
            ],
          },
        },
      });

      // Order 4 - DELIVERY
      const deliveryOrder = await prisma.order.create({
        data: {
          orderNumber: 104,
          type: 'DELIVERY',
          status: 'PREPARING',
          total: burger.price + fries.price + juice.price,
          items: {
            create: [
              { menuItemId: burger.id, menuItemName: burger.name, unitPrice: burger.price, quantity: 1 },
              { menuItemId: fries.id, menuItemName: fries.name, unitPrice: fries.price, quantity: 1 },
              { menuItemId: juice.id, menuItemName: juice.name, unitPrice: juice.price, quantity: 1 },
            ],
          },
        },
      });

      await prisma.delivery.create({
        data: {
          orderId: deliveryOrder.id,
          recipientName: 'فهد الزهراني',
          phone: '0501234567',
          address: 'شارع الملك فهد، الرياض، حي العليا',
          status: 'PREPARING',
        },
      });

      // Order 5 - COMPLETED
      await prisma.order.create({
        data: {
          orderNumber: 105,
          type: 'DINE_IN',
          status: 'COMPLETED',
          total: pizza.price * 2 + juice.price * 2,
          items: {
            create: [
              { menuItemId: pizza.id, menuItemName: pizza.name, unitPrice: pizza.price, quantity: 2 },
              { menuItemId: juice.id, menuItemName: juice.name, unitPrice: juice.price, quantity: 2 },
            ],
          },
        },
      });

      console.log('✅ Sample orders created');
    } else {
      console.log('⏭️  Orders already exist, skipping sample orders');
    }
  }

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📋 Demo accounts:');
  console.log('   admin / admin123   → مدير');
  console.log('   staff01 / staff123 → موظف');
  console.log('   chef01 / chef123   → شيف');
  console.log('   delivery01 / delivery123 → موظف توصيل');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
