import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.customer.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, phone, address } = body;

        const customer = await prisma.customer.update({
            where: { id: parseInt(id) },
            data: {
                name,
                phone,
                address,
            },
        });

        return NextResponse.json(customer);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
    }
}
