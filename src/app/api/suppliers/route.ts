import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const suppliers = await prisma.supplier.findMany({
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(suppliers);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, contact } = body;

        const supplier = await prisma.supplier.create({
            data: {
                name,
                contact,
            },
        });

        return NextResponse.json(supplier);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 });
    }
}
