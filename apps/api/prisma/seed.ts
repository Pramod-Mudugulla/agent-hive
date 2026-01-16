import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Seed Orders
    const orders = [
        { id: 'order_123', userId: 'user_1', status: 'SHIPPED', items: 'Laptop, Mouse', total: 1250.00 },
        { id: 'order_456', userId: 'user_1', status: 'DELIVERED', items: 'Keyboard', total: 150.00 },
        { id: 'order_789', userId: 'user_2', status: 'PROCESSING', items: 'Monitor', total: 300.00 },
    ];
    for (const o of orders) {
        await prisma.order.upsert({ where: { id: o.id }, update: {}, create: o });
    }

    // Seed Invoices
    const invoices = [
        { id: 'inv_1', orderId: 'order_123', amount: 1250.00, status: 'PAID' },
        { id: 'inv_2', orderId: 'order_456', amount: 150.00, status: 'PAID' },
        { id: 'inv_3', orderId: 'order_789', amount: 300.00, status: 'PENDING' },
    ];
    for (const i of invoices) {
        await prisma.invoice.upsert({ where: { id: i.id }, update: {}, create: i });
    }

    // Seed FAQs
    const faqs = [
        { id: 'faq_1', question: 'What is your return policy?', answer: 'You can return any item within 30 days of purchase.' },
        { id: 'faq_2', question: 'How do I track my order?', answer: 'You can track your order using the order ID in the chat.' },
        { id: 'faq_3', question: 'Do you ship internationally?', answer: 'Yes, we ship to over 50 countries.' },
    ];
    for (const f of faqs) {
        await prisma.fAQ.upsert({ where: { id: f.id }, update: {}, create: f });
    }

    console.log('Seeding complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
