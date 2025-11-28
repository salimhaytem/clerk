import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function parseCSV(filePath) {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

async function main() {
  const agenciesFile = path.join(__dirname, '../data/agencies_agency_rows.csv');
  const contactsFile = path.join(__dirname, '../data/contacts_contact_rows.csv');

  console.log('Parsing agencies CSV...');
  const agencies = await parseCSV(agenciesFile);
  console.log(`Found ${agencies.length} agencies.`);

  console.log('Parsing contacts CSV...');
  const contacts = await parseCSV(contactsFile);
  console.log(`Found ${contacts.length} contacts.`);

  // Transform and insert agencies
  console.log('Seeding agencies...');
  const agencyData = agencies.map(row => ({
    id: row.id,
    name: row.name,
    state: row.state || null,
    state_code: row.state_code || null,
    type: row.type || null,
    population: row.population ? parseInt(row.population, 10) : null,
    website: row.website || null,
    total_schools: row.total_schools ? parseInt(row.total_schools, 10) : null,
    total_students: row.total_students ? parseInt(row.total_students, 10) : null,
    mailing_address: row.mailing_address || null,
    grade_span: row.grade_span || null,
    locale: row.locale || null,
    csa_cbsa: row.csa_cbsa || null,
    domain_name: row.domain_name || null,
    physical_address: row.physical_address || null,
    phone: row.phone || null,
    status: row.status || null,
    student_teacher_ratio: row.student_teacher_ratio ? parseFloat(row.student_teacher_ratio) : null,
    supervisory_union: row.supervisory_union || null,
    county: row.county || null,
    created_at: row.created_at ? new Date(row.created_at) : null,
    updated_at: row.updated_at ? new Date(row.updated_at) : null,
  }));

  // Batch insert agencies
  // Using createMany with skipDuplicates to avoid errors on re-run if IDs exist
  // Note: createMany is supported in PostgreSQL
  await prisma.agency.createMany({
    data: agencyData,
    skipDuplicates: true,
  });
  console.log('Agencies seeded.');

  // Create a set of valid agency IDs
  const validAgencyIds = new Set(agencyData.map(a => a.id));

  // Transform and insert contacts
  console.log('Seeding contacts...');
  const contactData = contacts
    .filter(row => row.agency_id && validAgencyIds.has(row.agency_id)) // Filter out contacts with invalid agency_ids
    .map(row => ({
      id: row.id,
      first_name: row.first_name || null,
      last_name: row.last_name || null,
      email: row.email || null,
      phone: row.phone || null,
      title: row.title || null,
      email_type: row.email_type || null,
      contact_form_url: row.contact_form_url || null,
      created_at: row.created_at ? new Date(row.created_at) : null,
      updated_at: row.updated_at ? new Date(row.updated_at) : null,
      agency_id: row.agency_id || null,
      firm_id: row.firm_id || null,
      department: row.department || null,
    }));

  console.log(`Filtered to ${contactData.length} valid contacts.`);

  // Batch insert contacts
  await prisma.contact.createMany({
    data: contactData,
    skipDuplicates: true,
  });
  console.log('Contacts seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
