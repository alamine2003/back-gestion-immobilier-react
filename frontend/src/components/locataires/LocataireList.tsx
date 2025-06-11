import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/axios';
import { Locataire, PaginatedResponse } from '../../types';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import { useToast } from '../ui/ToastContainer';
import LocataireForm from './LocataireForm';

const LocataireList: React.FC = () => {
    const [locataires, setLocataires] = useState<Locataire[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedLocataire, setSelectedLocataire] = useState<Locataire | undefined>();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        search: ''
    });
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        fetchLocataires();
    }, [filters, page]);

    const fetchLocataires = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            params.append('page', page.toString());

            const response = await api.get<PaginatedResponse<Locataire>>(`/locataires?${params.toString()}`);
            if (response.success && response.data) {
                setLocataires(response.data.data);
                setTotalPages(response.data.total_pages);
                setError('');
            }
        } catch (err) {
            setError('Erreur lors du chargement des locataires');
            showToast('error', 'Erreur lors du chargement des locataires');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce locataire ?')) {
            try {
                const response = await api.delete<Locataire>(`/locataires/${id}`);
                if (response.success) {
                    setLocataires(locataires.filter(l => l.id !== id));
                    showToast('success', 'Locataire supprimé avec succès');
                }
            } catch (err) {
                showToast('error', 'Erreur lors de la suppression du locataire');
            }
        }
    };

    const handleEdit = (locataire: Locataire) => {
        setSelectedLocataire(locataire);
        setShowForm(true);
    };

    const handleAdd = () => {
        setSelectedLocataire(undefined);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        fetchLocataires();
        showToast('success', selectedLocataire ? 'Locataire modifié avec succès' : 'Locataire ajouté avec succès');
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFilters(prev => ({ ...prev, search: value }));
        setPage(1); // Reset to first page when filter changes
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
                    <h1 className="text-3xl font-bold text-gray-900">Locataires</h1>
                    <p className="mt-2 text-gray-600">
                        Gérez vos locataires et leurs locations
                    </p>
                </div>
                <Button
                    onClick={handleAdd}
                    variant="primary"
                    size="lg"
                >
                    Ajouter un locataire
                </Button>
            </div>

            {/* Filtres */}
            <Card className="p-6 mb-8">
                <div className="max-w-md">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                        Rechercher
                    </label>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Rechercher par nom, prénom, email..."
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </Card>

            {/* Liste des locataires */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                    {locataires.map((locataire) => (
                        <motion.div
                            key={locataire.id}
                            variants={itemVariants}
                            layout
                            className="relative"
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {locataire.prenom} {locataire.nom}
                                        </h3>
                                    </div>
                                    <div className="space-y-2 text-gray-600">
                                        <p>
                                            <span className="font-medium">Email:</span> {locataire.email}
                                        </p>
                                        <p>
                                            <span className="font-medium">Téléphone:</span> {locataire.telephone}
                                        </p>
                                        <p>
                                            <span className="font-medium">Date de naissance:</span>{' '}
                                            {new Date(locataire.date_naissance).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <span className="font-medium">Date d'entrée:</span>{' '}
                                            {new Date(locataire.date_entree).toLocaleDateString()}
                                        </p>
                                        {locataire.date_sortie && (
                                            <p>
                                                <span className="font-medium">Date de sortie:</span>{' '}
                                                {new Date(locataire.date_sortie).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-2">
                                        <Button
                                            onClick={() => handleEdit(locataire)}
                                            variant="secondary"
                                            size="sm"
                                        >
                                            Modifier
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(locataire.id)}
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
                <LocataireForm
                    locataire={selectedLocataire}
                    onSuccess={handleFormSuccess}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default LocataireList; 