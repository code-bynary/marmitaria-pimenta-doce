import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const expenses = await prisma.expense.findMany({
            include: {
                supplier: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(expenses);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { description, amount, supplierId, paymentMethod, status, dueDate, paidDate } = body;

        const expense = await prisma.expense.create({
            data: {
                description,
                amount: parseFloat(amount),
                supplierId: supplierId ? parseInt(supplierId) : null,
                paymentMethod,
                status,
                dueDate: dueDate ? new Date(dueDate) : null,
                paidDate: paidDate ? new Date(paidDate) : null,
            },
            include: {
                supplier: true,
            },
        });

        return NextResponse.json(expense);
    } catch (error) {
        console.error('Error creating expense:', error);
        return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
    }
}
