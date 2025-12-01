import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.supplier.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete supplier' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, contact } = body;

        const supplier = await prisma.supplier.update({
            where: { id: parseInt(id) },
            data: {
                name,
                contact,
            },
        });

        return NextResponse.json(supplier);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 });
    }
}
