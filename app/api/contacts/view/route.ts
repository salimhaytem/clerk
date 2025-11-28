import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { recordContactView } from '@/lib/contact-limits';

export async function POST(request: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contactId } = await request.json();

    if (!contactId) {
        return NextResponse.json({ error: 'Contact ID required' }, { status: 400 });
    }

    const result = await recordContactView(userId, contactId);

    if (!result.success) {
        return NextResponse.json(
            { error: 'Daily limit reached', remaining: 0 },
            { status: 429 }
        );
    }

    return NextResponse.json({ success: true, remaining: result.remaining });
}
