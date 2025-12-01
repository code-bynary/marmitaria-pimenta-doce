import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, paidDate } = body;

        const expense = await prisma.expense.update({
            where: { id: parseInt(id) },
            data: {
                status,
                paidDate: paidDate ? new Date(paidDate) : null,
            },
            include: {
                supplier: true,
            },
        });

        return NextResponse.json(expense);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.expense.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
    }
}
