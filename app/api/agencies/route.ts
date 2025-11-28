import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getRemainingViews } from '@/lib/contact-limits';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where = search
        ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { state: { contains: search, mode: 'insensitive' as const } },
                { type: { contains: search, mode: 'insensitive' as const } },
            ],
        }
        : {};

    const [agencies, total] = await Promise.all([
        prisma.agency.findMany({
            where,
            skip,
            take: limit,
            orderBy: { name: 'asc' },
        }),
        prisma.agency.count({ where }),
    ]);

    return NextResponse.json({
        agencies,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}
