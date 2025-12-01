import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.ingredient.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete ingredient' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, unit, cost } = body;

        const ingredient = await prisma.ingredient.update({
            where: { id: parseInt(id) },
            data: {
                name,
                unit,
                cost: parseFloat(cost),
            },
        });

        return NextResponse.json(ingredient);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update ingredient' }, { status: 500 });
    }
}
