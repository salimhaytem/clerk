import { getAgencies, getContacts, type Agency, type Contact } from './data';

// Cache en mémoire pour éviter de relire les fichiers à chaque requête
let agenciesCache: Agency[] | null = null;
let contactsCache: Contact[] | null = null;
let agenciesMap: Map<string, Agency> | null = null;

export function getCachedAgencies(): Agency[] {
    if (!agenciesCache) {
        agenciesCache = getAgencies();
    }
    return agenciesCache;
}

export function getCachedContacts(): Contact[] {
    if (!contactsCache) {
        contactsCache = getContacts();
    }
    return contactsCache;
}

export function getAgencyMap(): Map<string, Agency> {
    if (!agenciesMap) {
        const agencies = getCachedAgencies();
        agenciesMap = new Map(agencies.map(agency => [agency.id, agency]));
    }
    return agenciesMap;
}

// Fonction pour réinitialiser le cache (utile pour le développement)
export function clearCache() {
    agenciesCache = null;
    contactsCache = null;
    agenciesMap = null;
}

