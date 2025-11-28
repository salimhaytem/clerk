import { getAgencies, getContacts } from "@/lib/data";
import DashboardClient from "@/components/dashboard-client";

export default function DashboardPage() {
  const agencies = getAgencies();
  const contacts = getContacts();

  return (
    <DashboardClient
      agenciesCount={agencies.length}
      contactsCount={contacts.length}
    />
  );
}
