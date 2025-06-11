import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/axios';
import { Appartement, PaginatedResponse } from '../../types';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import { useToast } from '../ui/ToastContainer';

const AppartementList: React.FC = () => {
    const [appartements, setAppartements] = useState<Appartement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        fetchAppartements();
    }, [page]);

    const fetchAppartements = async () => {
        try {
            setLoading(true);
            const response = await api.get<PaginatedResponse<Appartement>>(`/appartements?page=${page}`);
            if (response.success && response.data) {
                setAppartements(response.data.data);
                setTotalPages(response.data.total_pages);
            }
        } catch (err) {
            setError('Erreur lors du chargement des appartements');
            showToast('error', 'Erreur lors du chargement des appartements');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet appartement ?')) {
            try {
                const response = await api.delete<Appartement>(`/appartements/${id}`);
                if (response.success) {
                    setAppartements(appartements.filter(a => a.id !== id));
                    showToast('success', 'Appartement supprimé avec succès');
                }
            } catch (err) {
                showToast('error', 'Erreur lors de la suppression de l\'appartement');
            }
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

    const getStatusColor = (statut: string) => {
        switch (statut) {
            case 'libre':
                return 'bg-green-100 text-green-800';
            case 'occupe':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
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
                    <h1 className="text-3xl font-bold text-gray-900">Appartements</h1>
                    <p className="mt-2 text-gray-600">
                        Gérez vos appartements et leurs locations
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/appartements/new')}
                    variant="primary"
                    size="lg"
                >
                    Ajouter un appartement
                </Button>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                    {appartements.map((appartement) => (
                        <motion.div
                            key={appartement.id}
                            variants={itemVariants}
                            layout
                            className="relative"
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            Appartement {appartement.numero}
                                        </h3>
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(appartement.statut)}`}>
                                            {appartement.statut}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-gray-600">
                                        <p>
                                            <span className="font-medium">Étage:</span> {appartement.etage}
                                        </p>
                                        <p>
                                            <span className="font-medium">Surface:</span> {appartement.surface} m²
                                        </p>
                                        <p>
                                            <span className="font-medium">Prix:</span> {appartement.prix} €
                                        </p>
                                        {appartement.batiment && (
                                            <p>
                                                <span className="font-medium">Bâtiment:</span> {appartement.batiment.nom}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-2">
                                        <Button
                                            onClick={() => navigate(`/appartements/${appartement.id}`)}
                                            variant="secondary"
                                            size="sm"
                                        >
                                            Détails
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(appartement.id)}
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
        </div>
    );
};

export default AppartementList; 