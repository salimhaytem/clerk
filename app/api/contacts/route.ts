import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getCachedContacts, getAgencyMap } from '@/lib/data-cache';
import { getRemainingViews } from '@/lib/contact-limits-simple';

export async function GET(request: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const remaining = await getRemainingViews(userId);

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';

        // Récupérer tous les contacts depuis le cache
        let contacts = getCachedContacts();
        const agencyMap = getAgencyMap();

        // Appliquer la recherche si nécessaire
        if (search) {
            const searchLower = search.toLowerCase();
            contacts = contacts.filter(contact => 
                contact.first_name?.toLowerCase().includes(searchLower) ||
                contact.last_name?.toLowerCase().includes(searchLower) ||
                contact.email?.toLowerCase().includes(searchLower) ||
                contact.title?.toLowerCase().includes(searchLower)
            );
        }

        // Calculer la pagination
        const total = contacts.length;
        const totalPages = Math.ceil(total / limit);
        const skip = (page - 1) * limit;
        const paginatedContacts = contacts.slice(skip, skip + limit);

        // Enrichir les contacts avec les informations de l'agence
        const enrichedContacts = paginatedContacts.map(contact => ({
            id: contact.id,
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.email,
            phone: contact.phone,
            title: contact.title,
            agency: contact.agency_id ? {
                name: agencyMap.get(contact.agency_id)?.name || 'Unknown',
                state: agencyMap.get(contact.agency_id)?.state || null,
            } : null,
        }));

        return NextResponse.json({
            contacts: enrichedContacts,
            remaining,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch contacts' },
            { status: 500 }
        );
    }
}
