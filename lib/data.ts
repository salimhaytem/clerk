import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface Agency {
    id: string;
    name: string;
    state: string;
    state_code: string;
    type: string;
    population: string;
    website: string;
    total_schools: string;
    total_students: string;
    mailing_address: string;
    grade_span: string;
    locale: string;
    csa_cbsa: string;
    domain_name: string;
    physical_address: string;
    phone: string;
    status: string;
    student_teacher_ratio: string;
    supervisory_union: string;
    county: string;
    created_at: string;
    updated_at: string;
}

export interface Contact {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    title: string;
    email_type: string;
    contact_form_url: string;
    created_at: string;
    updated_at: string;
    agency_id: string;
    firm_id: string;
    department: string;
}

export function getAgencies(): Agency[] {
    try {
        // Essayer plusieurs chemins possibles
        const possiblePaths = [
            path.join(process.cwd(), '..', 'data', 'agencies_agency_rows.csv'),
            path.join(process.cwd(), 'data', 'agencies_agency_rows.csv'),
            path.join(__dirname, '..', '..', 'data', 'agencies_agency_rows.csv'),
        ];

        let filePath: string | null = null;
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                filePath = p;
                break;
            }
        }

        if (!filePath) {
            console.error('Agencies CSV file not found. Tried paths:', possiblePaths);
            return [];
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
        });

        return records;
    } catch (error) {
        console.error('Error reading agencies CSV:', error);
        return [];
    }
}

export function getContacts(): Contact[] {
    try {
        // Essayer plusieurs chemins possibles
        const possiblePaths = [
            path.join(process.cwd(), '..', 'data', 'contacts_contact_rows.csv'),
            path.join(process.cwd(), 'data', 'contacts_contact_rows.csv'),
            path.join(__dirname, '..', '..', 'data', 'contacts_contact_rows.csv'),
        ];

        let filePath: string | null = null;
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                filePath = p;
                break;
            }
        }

        if (!filePath) {
            console.error('Contacts CSV file not found. Tried paths:', possiblePaths);
            return [];
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
        });

        return records;
    } catch (error) {
        console.error('Error reading contacts CSV:', error);
        return [];
    }
}

export function getAgencyById(id: string): Agency | undefined {
    const agencies = getAgencies();
    return agencies.find(agency => agency.id === id);
}

export function getContactsByAgencyId(agencyId: string): Contact[] {
    const contacts = getContacts();
    return contacts.filter(contact => contact.agency_id === agencyId);
}
