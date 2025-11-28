'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface UpgradePromptProps {
    remaining: number;
}

export function UpgradePrompt({ remaining }: UpgradePromptProps) {
    if (remaining > 0) return null;

    return (
        <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Daily Limit Reached</AlertTitle>
            <AlertDescription className="mt-2">
                You've reached your daily limit of 50 contact views. Upgrade your plan to view unlimited contacts.
                <div className="mt-4">
                    <Button variant="default" size="sm">
                        Upgrade Now
                    </Button>
                </div>
            </AlertDescription>
        </Alert>
    );
}
