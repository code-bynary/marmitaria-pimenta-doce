import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const ingredients = await prisma.ingredient.findMany({
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(ingredients);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch ingredients' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, unit, cost } = body;

        const ingredient = await prisma.ingredient.create({
            data: {
                name,
                unit,
                cost: parseFloat(cost),
            },
        });

        return NextResponse.json(ingredient);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create ingredient' }, { status: 500 });
    }
}
