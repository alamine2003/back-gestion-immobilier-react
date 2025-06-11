import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../utils/axios';
import { Location, Locataire } from '../../types';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import { useToast } from '../ui/ToastContainer';

interface LocationFormProps {
    location?: Location;
    onSuccess: () => void;
    onCancel: () => void;
}

const LocationForm: React.FC<LocationFormProps> = ({ location, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        locataire_id: 0,
        date_debut: '',
        date_fin: '',
        montant: 0,
        caution: 0,
        statut: 'en_cours' as 'en_cours' | 'termine' | 'annule'
    });
    const [locataires, setLocataires] = useState<Locataire[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        fetchLocataires();
        if (location) {
            setFormData({
                locataire_id: location.locataire_id,
                date_debut: location.date_debut ? new Date(location.date_debut).toISOString().split('T')[0] : '',
                date_fin: location.date_fin ? new Date(location.date_fin).toISOString().split('T')[0] : '',
                montant: location.montant || 0,
                caution: location.caution || 0,
                statut: location.statut || 'en_cours'
            });
        }
    }, [location]);

    const fetchLocataires = async () => {
        try {
            const response = await api.get<Locataire[]>('/locataires');
            if (response.success && response.data) {
                setLocataires(response.data);
            }
        } catch (err) {
            setError('Erreur lors du chargement des locataires');
            showToast('error', 'Erreur lors du chargement des locataires');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (location) {
                const response = await api.put<Location>(`/locations/${location.id}`, formData);
                if (response.success) {
                    showToast('success', 'Location modifiée avec succès');
                    onSuccess();
                }
            } else {
                const response = await api.post<Location>('/locations', formData);
                if (response.success) {
                    showToast('success', 'Location ajoutée avec succès');
                    onSuccess();
                }
            }
        } catch (err) {
            setError('Une erreur est survenue lors de l\'enregistrement');
            showToast('error', 'Erreur lors de l\'enregistrement de la location');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['locataire_id', 'montant', 'caution'].includes(name) 
                ? parseInt(value) || 0 
                : value
        }));
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.8,
            transition: {
                duration: 0.2,
                ease: "easeIn"
            }
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={modalVariants}
                className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4"
            >
                <Card className="max-w-md w-full">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {location ? 'Modifier la location' : 'Ajouter une location'}
                        </h2>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="locataire_id" className="block text-sm font-medium text-gray-700 mb-2">
                                    Locataire
                                </label>
                                <select
                                    name="locataire_id"
                                    id="locataire_id"
                                    required
                                    value={formData.locataire_id}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="">Sélectionner un locataire</option>
                                    {locataires.map(locataire => (
                                        <option key={locataire.id} value={locataire.id}>
                                            {locataire.nom} {locataire.prenom}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="date_debut" className="block text-sm font-medium text-gray-700 mb-2">
                                        Date de début
                                    </label>
                                    <input
                                        type="date"
                                        name="date_debut"
                                        id="date_debut"
                                        required
                                        value={formData.date_debut}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="date_fin" className="block text-sm font-medium text-gray-700 mb-2">
                                        Date de fin
                                    </label>
                                    <input
                                        type="date"
                                        name="date_fin"
                                        id="date_fin"
                                        required
                                        value={formData.date_fin}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="montant" className="block text-sm font-medium text-gray-700 mb-2">
                                        Montant (€)
                                    </label>
                                    <input
                                        type="number"
                                        name="montant"
                                        id="montant"
                                        required
                                        min="0"
                                        value={formData.montant}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="caution" className="block text-sm font-medium text-gray-700 mb-2">
                                        Caution (€)
                                    </label>
                                    <input
                                        type="number"
                                        name="caution"
                                        id="caution"
                                        min="0"
                                        value={formData.caution}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-2">
                                    Statut
                                </label>
                                <select
                                    name="statut"
                                    id="statut"
                                    required
                                    value={formData.statut}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="en_cours">En cours</option>
                                    <option value="termine">Terminé</option>
                                    <option value="annule">Annulé</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    type="button"
                                    onClick={onCancel}
                                    variant="secondary"
                                    size="default"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    variant="default"
                                    size="default"
                                    loading={loading}
                                >
                                    {location ? 'Modifier' : 'Ajouter'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
};

export default LocationForm; 