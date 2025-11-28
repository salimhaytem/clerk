'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, ArrowRight, TrendingUp } from "lucide-react";

interface DashboardData {
    agenciesCount: number;
    contactsCount: number;
}

export default function DashboardClient({ agenciesCount, contactsCount }: DashboardData) {
    const [animatedAgencies, setAnimatedAgencies] = useState(0);
    const [animatedContacts, setAnimatedContacts] = useState(0);

    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const agencyIncrement = agenciesCount / steps;
        const contactIncrement = contactsCount / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            if (currentStep <= steps) {
                setAnimatedAgencies(Math.floor(agencyIncrement * currentStep));
                setAnimatedContacts(Math.floor(contactIncrement * currentStep));
            } else {
                setAnimatedAgencies(agenciesCount);
                setAnimatedContacts(contactsCount);
                clearInterval(timer);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [agenciesCount, contactsCount]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto px-6 py-12">
                {/* Hero Section */}
                <div className="mb-12 text-center animate-fade-in">
                    <h2 className="text-5xl font-extrabold mb-4">
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Tableau de bord
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Gérez vos agences et contacts en toute simplicité avec une interface moderne et intuitive
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Agencies Card */}
                    <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-500 to-indigo-600 text-white transform hover:-translate-y-2">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
                        <CardHeader className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                                    <Building2 className="h-8 w-8" />
                                </div>
                                <TrendingUp className="h-6 w-6 opacity-50" />
                            </div>
                            <CardTitle className="text-2xl font-bold mb-2">Agences</CardTitle>
                            <CardDescription className="text-blue-100">
                                Total des agences enregistrées
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-6xl font-extrabold mb-2 tabular-nums">
                                {animatedAgencies.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2 text-blue-100">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm">Système actif</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contacts Card */}
                    <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-purple-500 to-pink-600 text-white transform hover:-translate-y-2">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
                        <CardHeader className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                                    <Users className="h-8 w-8" />
                                </div>
                                <TrendingUp className="h-6 w-6 opacity-50" />
                            </div>
                            <CardTitle className="text-2xl font-bold mb-2">Contacts</CardTitle>
                            <CardDescription className="text-purple-100">
                                Total des contacts disponibles
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-6xl font-extrabold mb-2 tabular-nums">
                                {animatedContacts.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2 text-purple-100">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm">Base de données synchronisée</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Navigation Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">Actions rapides</h3>
                        <p className="text-gray-600">Accédez directement à vos données</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Agencies Navigation */}
                        <Link href="/dashboard/agencies" className="group">
                            <Card className="border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 bg-white">
                                <CardContent className="p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                            <Building2 className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all duration-300" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        Gestion des agences
                                    </h4>
                                    <p className="text-gray-600 mb-4">
                                        Consultez et gérez toutes vos agences
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold">
                                        <span>Voir tout</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* Contacts Navigation */}
                        <Link href="/dashboard/contacts" className="group">
                            <Card className="border-2 border-gray-200 hover:border-purple-500 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 bg-white">
                                <CardContent className="p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                            <Users className="h-8 w-8 text-purple-600" />
                                        </div>
                                        <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-2 transition-all duration-300" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                                        Gestion des contacts
                                    </h4>
                                    <p className="text-gray-600 mb-4">
                                        Accédez à votre base de contacts
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-purple-600 font-semibold">
                                        <span>Voir tout</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
