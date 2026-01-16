import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const supportTools = {
    query_knowledge_base: {
        description: 'Queries the internal knowledge base for general information.',
        parameters: z.object({
            query: z.string().describe('The search query for the knowledge base.'),
        }),
        execute: async ({ query }) => {
            const faqs = await prisma.fAQ.findMany({
                where: {
                    OR: [
                        { question: { contains: query, mode: 'insensitive' } },
                        { answer: { contains: query, mode: 'insensitive' } },
                    ],
                },
            });
            return faqs.length > 0 ? faqs : "No relevant information found in knowledge base.";
        },
    },
    search_faqs: {
        description: 'Searches the frequently asked questions.',
        parameters: z.object({
            category: z.string().optional().describe('Optional category to filter FAQs.'),
        }),
        execute: async ({ category }) => {
            const faqs = await prisma.fAQ.findMany();
            return faqs;
        },
    },
};
export const ordersTools = {
    get_order_details: {
        description: 'Retrieves details for a specific order.',
        parameters: z.object({
            orderId: z.string().describe('The ID of the order to retrieve.'),
        }),
        execute: async ({ orderId }) => {
            const order = await prisma.order.findUnique({ where: { id: orderId } });
            return order || "Order not found.";
        },
    },
    track_delivery: {
        description: 'Tracks the delivery status of an order.',
        parameters: z.object({
            orderId: z.string().describe('The ID of the order to track.'),
        }),
        execute: async ({ orderId }) => {
            const order = await prisma.order.findUnique({ where: { id: orderId } });
            if (!order)
                return "Order not found.";
            return { status: order.status, estimatedDelivery: "Tomorrow" };
        },
    },
    update_order: {
        description: 'Updates order information.',
        parameters: z.object({
            orderId: z.string().describe('The ID of the order to update.'),
            action: z.enum(['cancel', 'change_address']).describe('The action to perform.'),
        }),
        execute: async ({ orderId, action }) => {
            if (action === 'cancel') {
                const order = await prisma.order.update({
                    where: { id: orderId },
                    data: { status: 'CANCELLED' },
                });
                return `Order ${orderId} has been cancelled successfully.`;
            }
            return "Action not implemented yet.";
        },
    },
};
export const billingTools = {
    get_invoice_details: {
        description: 'Retrieves invoice details for an order.',
        parameters: z.object({
            orderId: z.string().describe('The ID of the order to get the invoice for.'),
        }),
        execute: async ({ orderId }) => {
            const invoice = await prisma.invoice.findFirst({ where: { orderId } });
            return invoice || "Invoice not found.";
        },
    },
    check_refund_status: {
        description: 'Checks the status of a refund request.',
        parameters: z.object({
            orderId: z.string().describe('The ID of the order to check refund for.'),
        }),
        execute: async ({ orderId }) => {
            const invoice = await prisma.invoice.findFirst({ where: { orderId } });
            if (!invoice)
                return "Invoice not found.";
            return { status: invoice.status === 'REFUNDED' ? 'Refunded' : 'Not Refunded' };
        },
    },
};
