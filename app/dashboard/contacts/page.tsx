'use client';

import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Contact {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    title: string | null;
    agency: {
        name: string;
        state: string | null;
    } | null;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [remaining, setRemaining] = useState<number | null>(null);
    const [limitReached, setLimitReached] = useState(false);

    const fetchContacts = async (page: number = 1, searchTerm: string = '') => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: pagination.limit.toString(),
            });
            if (searchTerm) {
                params.append('search', searchTerm);
            }

            const response = await fetch(`/api/contacts?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch contacts');
            }

            const data = await response.json();
            setContacts(data.contacts || []);
            setPagination(data.pagination || pagination);
            setRemaining(data.remaining ?? null);
            
            // Check if limit is reached
            if (data.remaining === 0 && data.contacts.length === 0) {
                setLimitReached(true);
            } else {
                setLimitReached(false);
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts(1, search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages && !limitReached) {
            fetchContacts(newPage, search);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Contacts</CardTitle>
                    <CardDescription>
                        {loading ? (
                            'Loading...'
                        ) : limitReached ? (
                            <span className="text-red-600">Daily limit reached (50 contacts/day)</span>
                        ) : (
                            `Viewing ${pagination.total} total contacts${remaining !== null ? ` • ${remaining} views remaining today` : ''}`
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {limitReached ? (
                        <div className="rounded-md border border-yellow-300 bg-yellow-50 p-6 text-center">
                            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                                Daily Contact Limit Reached
                            </h3>
                            <p className="text-yellow-700 mb-4">
                                You have reached your daily limit of 50 contact views. Please upgrade your plan to view more contacts.
                            </p>
                            <Button className="bg-yellow-600 hover:bg-yellow-700">
                                Upgrade Plan
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4">
                                <form onSubmit={handleSearch} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, or title..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                    <Button type="submit">Search</Button>
                                    {search && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setSearchInput('');
                                                setSearch('');
                                            }}
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </form>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-10">
                                    <div className="text-muted-foreground">Loading contacts...</div>
                                </div>
                            ) : (
                                <>
                                    <div className="rounded-md border overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>Phone</TableHead>
                                                    <TableHead>Title</TableHead>
                                                    <TableHead>Agency</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {contacts.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                                            No contacts found
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    contacts.map((contact) => (
                                                        <TableRow key={contact.id}>
                                                            <TableCell className="font-medium">
                                                                {contact.first_name || ''} {contact.last_name || ''}
                                                            </TableCell>
                                                            <TableCell>
                                                                {contact.email ? (
                                                                    <a
                                                                        href={`mailto:${contact.email}`}
                                                                        className="text-blue-600 hover:underline"
                                                                    >
                                                                        {contact.email}
                                                                    </a>
                                                                ) : (
                                                                    'N/A'
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {contact.phone || 'N/A'}
                                                            </TableCell>
                                                            <TableCell>
                                                                {contact.title || 'N/A'}
                                                            </TableCell>
                                                            <TableCell>
                                                                {contact.agency?.name || 'N/A'}
                                                                {contact.agency?.state && (
                                                                    <span className="text-muted-foreground ml-1">
                                                                        ({contact.agency.state})
                                                                    </span>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {pagination.totalPages > 1 && (
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="text-sm text-muted-foreground">
                                                Page {pagination.page} of {pagination.totalPages}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handlePageChange(pagination.page - 1)}
                                                    disabled={pagination.page === 1}
                                                >
                                                    Previous
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handlePageChange(pagination.page + 1)}
                                                    disabled={pagination.page === pagination.totalPages}
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
