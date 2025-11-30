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

interface Agency {
    id: string;
    name: string;
    state: string | null;
    state_code: string | null;
    type: string | null;
    population: number | null;
    website: string | null;
    phone: string | null;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function AgenciesPage() {
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const fetchAgencies = async (page: number = 1, searchTerm: string = '') => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: pagination.limit.toString(),
            });
            if (searchTerm) {
                params.append('search', searchTerm);
            }

            const response = await fetch(`/api/agencies?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch agencies');
            }

            const data = await response.json();
            setAgencies(data.agencies || []);
            setPagination(data.pagination || pagination);
        } catch (error) {
            console.error('Error fetching agencies:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgencies(1, search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchAgencies(newPage, search);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Agencies</CardTitle>
                    <CardDescription>
                        {loading ? 'Loading...' : `Viewing ${pagination.total} total agencies`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search by name, state, or type..."
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
                            <div className="text-muted-foreground">Loading agencies...</div>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>State</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Population</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>Website</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {agencies.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                                    No agencies found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            agencies.map((agency) => (
                                                <TableRow key={agency.id}>
                                                    <TableCell className="font-medium">
                                                        {agency.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {agency.state || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {agency.type || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {agency.population?.toLocaleString() || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {agency.phone || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {agency.website ? (
                                                            <a
                                                                href={agency.website}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                Visit
                                                            </a>
                                                        ) : (
                                                            'N/A'
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
                </CardContent>
            </Card>
        </div>
    );
}
