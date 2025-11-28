import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getContacts } from '@/lib/data';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ContactsPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const contacts = getContacts();
    const columns = contacts.length ? Object.keys(contacts[0]) : [];

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Contacts</CardTitle>
                    <CardDescription>
                        Viewing {contacts.length} total contacts
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {columns.map((col) => (
                                        <TableHead key={col}>{col}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contacts.map((row) => (
                                    <TableRow key={(row as any).id}>
                                        {columns.map((col) => {
                                            const value = (row as any)[col];
                                            const isEmpty = value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
                                            const display = isEmpty ? 'N/A' : value;
                                            return (
                                                <TableCell key={col} className={col === 'first_name' ? 'font-medium' : ''}>
                                                    {col === 'email' && value ? (
                                                        <a href={`mailto:${value}`} className="text-blue-600 hover:underline">{value}</a>
                                                    ) : col === 'contact_form_url' && value ? (
                                                        <a href={String(value)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Link</a>
                                                    ) : (
                                                        String(display)
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
