import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getRemainingViews, canViewContact } from '@/lib/contact-limits';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const remaining = await getRemainingViews(userId);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where = search
        ? {
            OR: [
                { first_name: { contains: search, mode: 'insensitive' as const } },
                { last_name: { contains: search, mode: 'insensitive' as const } },
                { email: { contains: search, mode: 'insensitive' as const } },
                { title: { contains: search, mode: 'insensitive' as const } },
            ],
        }
        : {};

    const [contacts, total] = await Promise.all([
        prisma.contact.findMany({
            where,
            skip,
            take: limit,
            include: {
                agency: {
                    select: {
                        name: true,
                        state: true,
                    },
                },
            },
            orderBy: { first_name: 'asc' },
        }),
        prisma.contact.count({ where }),
    ]);

    return NextResponse.json({
        contacts,
        remaining,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}
