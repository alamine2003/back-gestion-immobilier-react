import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../utils/axios';
import { Charge, PaginatedResponse } from '../../types';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import { useToast } from '../ui/ToastContainer';
import ChargeForm from './ChargeForm';

const ChargeList: React.FC = () => {
    const [charges, setCharges] = useState<Charge[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedCharge, setSelectedCharge] = useState<Charge | undefined>();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        type: '',
        date_debut: '',
        date_fin: '',
        search: ''
    });
    const { showToast } = useToast();

    useEffect(() => {
        fetchCharges();
    }, [filters, page]);

    const fetchCharges = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.type) params.append('type', filters.type);
            if (filters.date_debut) params.append('date_debut', filters.date_debut);
            if (filters.date_fin) params.append('date_fin', filters.date_fin);
            if (filters.search) params.append('search', filters.search);
            params.append('page', page.toString());

            const response = await api.get<PaginatedResponse<Charge>>(`/charges?${params.toString()}`);
            if (response.success && response.data) {
                setCharges(response.data.data);
                setTotalPages(response.data.total_pages);
                setError('');
            }
        } catch (err) {
            setError('Erreur lors du chargement des charges');
            showToast('error', 'Erreur lors du chargement des charges');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette charge ?')) {
            try {
                const response = await api.delete<Charge>(`/charges/${id}`);
                if (response.success) {
                    setCharges(charges.filter(c => c.id !== id));
                    showToast('success', 'Charge supprimée avec succès');
                }
            } catch (err) {
                showToast('error', 'Erreur lors de la suppression de la charge');
            }
        }
    };

    const handleEdit = (charge: Charge) => {
        setSelectedCharge(charge);
        setShowForm(true);
    };

    const handleAdd = () => {
        setSelectedCharge(undefined);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        fetchCharges();
        showToast('success', selectedCharge ? 'Charge modifiée avec succès' : 'Charge ajoutée avec succès');
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(1);
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'taxe': return 'bg-blue-100 text-blue-800';
            case 'entretien': return 'bg-green-100 text-green-800';
            case 'assurance': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
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
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Charges</h1>
                    <p className="mt-2 text-gray-600">
                        Gérez les charges de vos biens immobiliers
                    </p>
                </div>
                <Button
                    onClick={handleAdd}
                    variant="primary"
                    size="lg"
                >
                    Ajouter une charge
                </Button>
            </div>

            {/* Filtres */}
            <Card className="p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="">Tous</option>
                            <option value="taxe">Taxe</option>
                            <option value="entretien">Entretien</option>
                            <option value="assurance">Assurance</option>
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

            {/* Liste des charges */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                    {charges.map((charge) => (
                        <motion.div
                            key={charge.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="relative"
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                Charge #{charge.id}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {charge.description}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(charge.type)}`}>
                                            {charge.type}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-gray-600">
                                        <p>
                                            <span className="font-medium">Montant:</span>{' '}
                                            {charge.montant} €
                                        </p>
                                        <p>
                                            <span className="font-medium">Date:</span>{' '}
                                            {new Date(charge.date).toLocaleDateString()}
                                        </p>
                                        {charge.reference && (
                                            <p>
                                                <span className="font-medium">Référence:</span>{' '}
                                                {charge.reference}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-2">
                                        <Button
                                            onClick={() => handleEdit(charge)}
                                            variant="secondary"
                                            size="sm"
                                        >
                                            Modifier
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(charge.id)}
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
                <ChargeForm
                    charge={selectedCharge}
                    onSuccess={handleFormSuccess}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default ChargeList; 