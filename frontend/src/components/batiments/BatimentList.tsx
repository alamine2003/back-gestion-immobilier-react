import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/axios';
import { Batiment } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useToast } from '../ui/ToastContainer';
import { PaginatedResponse } from '../../types';

const BatimentList: React.FC = () => {
    const [batiments, setBatiments] = useState<Batiment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        fetchBatiments();
    }, [page]);

    const fetchBatiments = async () => {
        try {
            setLoading(true);
            const response = await api.get<PaginatedResponse<Batiment>>(`/batiments?page=${page}`);
            if (response.success && response.data) {
                setBatiments(response.data.data);
                setTotalPages(response.data.total_pages);
            }
        } catch (err) {
            setError('Erreur lors du chargement des bâtiments');
            showToast('error', 'Erreur lors du chargement des bâtiments');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce bâtiment ?')) {
            try {
                const response = await api.delete<Batiment>(`/batiments/${id}`);
                if (response.success) {
                    setBatiments(batiments.filter(b => b.id !== id));
                    showToast('success', 'Bâtiment supprimé avec succès');
                }
            } catch (err) {
                showToast('error', 'Erreur lors de la suppression du bâtiment');
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
                    <h1 className="text-3xl font-bold text-gray-900">Bâtiments</h1>
                    <p className="mt-2 text-gray-600">
                        Gérez vos bâtiments et leurs appartements
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/batiments/new')}
                    variant="primary"
                    size="lg"
                >
                    Ajouter un bâtiment
                </Button>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                    {batiments.map((batiment) => (
                        <motion.div
                            key={batiment.id}
                            variants={itemVariants}
                            layout
                            className="relative"
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {batiment.nom}
                                    </h3>
                                    <div className="space-y-2 text-gray-600">
                                        <p>
                                            <span className="font-medium">Adresse:</span> {batiment.adresse}
                                        </p>
                                        <p>
                                            <span className="font-medium">Ville:</span> {batiment.ville}
                                        </p>
                                        <p>
                                            <span className="font-medium">Code postal:</span> {batiment.code_postal}
                                        </p>
                                        <p>
                                            <span className="font-medium">Appartements:</span> {batiment.nombre_appartements}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-2">
                                        <Button
                                            onClick={() => navigate(`/batiments/${batiment.id}`)}
                                            variant="secondary"
                                            size="sm"
                                        >
                                            Détails
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(batiment.id)}
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

export default BatimentList; 