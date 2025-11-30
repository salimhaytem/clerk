import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getCachedAgencies } from '@/lib/data-cache';

export async function GET(request: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';

        // Récupérer toutes les agences depuis le cache
        let agencies = getCachedAgencies();

        // Appliquer la recherche si nécessaire
        if (search) {
            const searchLower = search.toLowerCase();
            agencies = agencies.filter(agency => 
                agency.name?.toLowerCase().includes(searchLower) ||
                agency.state?.toLowerCase().includes(searchLower) ||
                agency.type?.toLowerCase().includes(searchLower)
            );
        }

        // Calculer la pagination
        const total = agencies.length;
        const totalPages = Math.ceil(total / limit);
        const skip = (page - 1) * limit;
        const paginatedAgencies = agencies.slice(skip, skip + limit);

        return NextResponse.json({
            agencies: paginatedAgencies,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        });
    } catch (error) {
        console.error('Error fetching agencies:', error);
        return NextResponse.json(
            { error: 'Failed to fetch agencies' },
            { status: 500 }
        );
    }
}
