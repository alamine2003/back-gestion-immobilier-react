import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../utils/axios';
import { Paiement, PaginatedResponse } from '../../types';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import { useToast } from '../ui/ToastContainer';
import PaiementForm from './PaiementForm';

const PaiementList: React.FC = () => {
    const [paiements, setPaiements] = useState<Paiement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedPaiement, setSelectedPaiement] = useState<Paiement | undefined>();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        statut: '',
        mode_paiement: '',
        date_debut: '',
        date_fin: '',
        search: ''
    });
    const { showToast } = useToast();

    useEffect(() => {
        fetchPaiements();
    }, [filters, page]);

    const fetchPaiements = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.statut) params.append('statut', filters.statut);
            if (filters.mode_paiement) params.append('mode_paiement', filters.mode_paiement);
            if (filters.date_debut) params.append('date_debut', filters.date_debut);
            if (filters.date_fin) params.append('date_fin', filters.date_fin);
            if (filters.search) params.append('search', filters.search);
            params.append('page', page.toString());

            const response = await api.get<PaginatedResponse<Paiement>>(`/paiements?${params.toString()}`);
            if (response.success && response.data) {
                setPaiements(response.data.data);
                setTotalPages(response.data.total_pages);
                setError('');
            }
        } catch (err) {
            setError('Erreur lors du chargement des paiements');
            showToast('error', 'Erreur lors du chargement des paiements');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
            try {
                const response = await api.delete<Paiement>(`/paiements/${id}`);
                if (response.success) {
                    setPaiements(paiements.filter(p => p.id !== id));
                    showToast('success', 'Paiement supprimé avec succès');
                }
            } catch (err) {
                showToast('error', 'Erreur lors de la suppression du paiement');
            }
        }
    };

    const handleEdit = (paiement: Paiement) => {
        setSelectedPaiement(paiement);
        setShowForm(true);
    };

    const handleAdd = () => {
        setSelectedPaiement(undefined);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        fetchPaiements();
        showToast('success', selectedPaiement ? 'Paiement modifié avec succès' : 'Paiement ajouté avec succès');
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(1); // Reset to first page when filter changes
    };

    const getStatutColor = (statut: string) => {
        switch (statut) {
            case 'valide': return 'bg-green-100 text-green-800';
            case 'refuse': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="p-6 m-4">
                <div className="text-red-500 text-center">{error}</div>
            </Card>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Paiements</h1>
                    <p className="mt-2 text-gray-600">
                        Gérez les paiements de vos locations
                    </p>
                </div>
                <Button
                    onClick={handleAdd}
                    variant="primary"
                    size="lg"
                >
                    Ajouter un paiement
                </Button>
            </div>

            {/* Filtres */}
            <Card className="p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                        <select
                            name="statut"
                            value={filters.statut}
                            onChange={handleFilterChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="">Tous</option>
                            <option value="en_attente">En attente</option>
                            <option value="valide">Validé</option>
                            <option value="refuse">Refusé</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mode de paiement</label>
                        <select
                            name="mode_paiement"
                            value={filters.mode_paiement}
                            onChange={handleFilterChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="">Tous</option>
                            <option value="virement">Virement</option>
                            <option value="cheque">Chèque</option>
                            <option value="especes">Espèces</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date début</label>
                        <input
                            type="date"
                            name="date_debut"
                            value={filters.date_debut}
                            onChange={handleFilterChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
                        <input
                            type="date"
                            name="date_fin"
                            value={filters.date_fin}
                            onChange={handleFilterChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Rechercher..."
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>
            </Card>

            {/* Liste des paiements */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                    {paiements.map((paiement) => (
                        <motion.div
                            key={paiement.id}
                            variants={itemVariants}
                            layout
                            className="relative"
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                Paiement #{paiement.id}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Location #{paiement.location_id}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(paiement.statut)}`}>
                                            {paiement.statut}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-gray-600">
                                        <p>
                                            <span className="font-medium">Montant:</span>{' '}
                                            {paiement.montant} €
                                        </p>
                                        <p>
                                            <span className="font-medium">Date:</span>{' '}
                                            {new Date(paiement.date_paiement).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <span className="font-medium">Mode:</span>{' '}
                                            {paiement.mode_paiement}
                                        </p>
                                        {paiement.reference && (
                                            <p>
                                                <span className="font-medium">Référence:</span>{' '}
                                                {paiement.reference}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-2">
                                        <Button
                                            onClick={() => handleEdit(paiement)}
                                            variant="secondary"
                                            size="sm"
                                        >
                                            Modifier
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(paiement.id)}
                                            variant="danger"
                                            size="sm"
                                        >
                                            Supprimer
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {totalPages > 1 && (
                <div className="mt-8 flex justify-center space-x-2">
                    <Button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        variant="secondary"
                        size="sm"
                    >
                        Précédent
                    </Button>
                    <span className="py-2 px-4 text-gray-600">
                        Page {page} sur {totalPages}
                    </span>
                    <Button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        variant="secondary"
                        size="sm"
                    >
                        Suivant
                    </Button>
                </div>
            )}

            {showForm && (
                <PaiementForm
                    paiement={selectedPaiement}
                    onSuccess={handleFormSuccess}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default PaiementList; 