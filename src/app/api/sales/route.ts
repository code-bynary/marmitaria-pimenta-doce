import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const sales = await prisma.sale.findMany({
            include: {
                customer: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(sales);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerId, items, paymentMethod, paymentStatus } = body;

        // Calculate total
        const totalAmount = items.reduce((sum: number, item: any) => {
            return sum + (item.unitPrice * item.quantity);
        }, 0);

        const sale = await prisma.sale.create({
            data: {
                customerId: customerId ? parseInt(customerId) : null,
                totalAmount,
                paymentMethod,
                paymentStatus,
                items: {
                    create: items.map((item: any) => ({
                        productId: parseInt(item.productId),
                        quantity: parseInt(item.quantity),
                        unitPrice: parseFloat(item.unitPrice),
                    })),
                },
            },
            include: {
                customer: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // Update customer balance if payment is pending
        if (customerId && paymentStatus === 'Pending') {
            await prisma.customer.update({
                where: { id: parseInt(customerId) },
                data: {
                    balance: {
                        increment: totalAmount,
                    },
                },
            });
        }

        return NextResponse.json(sale);
    } catch (error) {
        console.error('Error creating sale:', error);
        return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 });
    }
}
