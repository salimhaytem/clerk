// Version simplifiée sans base de données
// Pour une vraie implémentation, vous aurez besoin d'une base de données

const DAILY_CONTACT_LIMIT = 50;

export async function getRemainingViews(userId: string): Promise<number> {
    // Pour l'instant, retourner toujours la limite complète
    // Dans une vraie application, vous devriez utiliser une base de données
    // pour tracker les vues par utilisateur
    return DAILY_CONTACT_LIMIT;
}

export { DAILY_CONTACT_LIMIT };

