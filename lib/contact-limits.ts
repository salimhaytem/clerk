import { prisma } from './prisma';

const DAILY_CONTACT_LIMIT = 50;

export async function getDailyViewCount(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await prisma.contactView.count({
        where: {
            userId,
            viewedAt: {
                gte: today,
                lt: tomorrow,
            },
        },
    });

    return count;
}

export async function getRemainingViews(userId: string): Promise<number> {
    const viewCount = await getDailyViewCount(userId);
    return Math.max(0, DAILY_CONTACT_LIMIT - viewCount);
}

export async function canViewContact(userId: string): Promise<boolean> {
    const remaining = await getRemainingViews(userId);
    return remaining > 0;
}

export async function recordContactView(
    userId: string,
    contactId: string
): Promise<{ success: boolean; remaining: number }> {
    const canView = await canViewContact(userId);

    if (!canView) {
        return { success: false, remaining: 0 };
    }

    await prisma.contactView.create({
        data: {
            userId,
            contactId,
        },
    });

    const remaining = await getRemainingViews(userId);
    return { success: true, remaining };
}

export { DAILY_CONTACT_LIMIT };
