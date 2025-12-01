import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: {
                ingredients: {
                    include: {
                        ingredient: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, price, ingredients } = body;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                ingredients: {
                    create: ingredients.map((ing: any) => ({
                        ingredientId: parseInt(ing.ingredientId),
                        quantity: parseFloat(ing.quantity),
                    })),
                },
            },
            include: {
                ingredients: {
                    include: {
                        ingredient: true,
                    },
                },
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
