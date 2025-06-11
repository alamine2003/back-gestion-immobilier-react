import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../utils/axios';
import { Paiement, Location } from '../../types';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import { useToast } from '../ui/ToastContainer';

interface PaiementFormProps {
    paiement?: Paiement;
    onSuccess: () => void;
    onCancel: () => void;
}

const PaiementForm: React.FC<PaiementFormProps> = ({ paiement, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        location_id: paiement?.location_id || '',
        montant: paiement?.montant || '',
        date_paiement: paiement?.date_paiement ? new Date(paiement.date_paiement).toISOString().split('T')[0] : '',
        mode_paiement: paiement?.mode_paiement || '',
        reference: paiement?.reference || '',
        statut: paiement?.statut || 'en_attente'
    });
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await api.get<Location[]>('/locations');
            if (response.success && response.data) {
                setLocations(response.data);
            }
        } catch (err) {
            setError('Erreur lors du chargement des locations');
            showToast('error', 'Erreur lors du chargement des locations');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = paiement
                ? await api.put<Paiement>(`/paiements/${paiement.id}`, formData)
                : await api.post<Paiement>('/paiements', formData);

            if (response.success) {
                onSuccess();
            }
        } catch (err) {
            setError('Erreur lors de l\'enregistrement du paiement');
            showToast('error', 'Erreur lors de l\'enregistrement du paiement');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
            <Card className="w-full max-w-2xl">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {paiement ? 'Modifier le paiement' : 'Nouveau paiement'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <select
                                name="location_id"
                                value={formData.location_id}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Sélectionner une location</option>
                                {locations.map(location => (
                                    <option key={location.id} value={location.id}>
                                        Location #{location.id} - {location.locataire?.nom} {location.locataire?.prenom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Montant (€)
                            </label>
                            <input
                                type="number"
                                name="montant"
                                value={formData.montant}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date de paiement
                            </label>
                            <input
                                type="date"
                                name="date_paiement"
                                value={formData.date_paiement}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mode de paiement
                            </label>
                            <select
                                name="mode_paiement"
                                value={formData.mode_paiement}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Sélectionner un mode de paiement</option>
                                <option value="virement">Virement</option>
                                <option value="cheque">Chèque</option>
                                <option value="especes">Espèces</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Référence
                            </label>
                            <input
                                type="text"
                                name="reference"
                                value={formData.reference}
                                onChange={handleChange}
                                placeholder="Numéro de chèque, référence de virement..."
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Statut
                            </label>
                            <select
                                name="statut"
                                value={formData.statut}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="en_attente">En attente</option>
                                <option value="valide">Validé</option>
                                <option value="refuse">Refusé</option>
                            </select>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button
                                type="button"
                                onClick={onCancel}
                                variant="secondary"
                                size="md"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                disabled={loading}
                            >
                                {loading ? 'Enregistrement...' : (paiement ? 'Modifier' : 'Ajouter')}
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </motion.div>
    );
};

export default PaiementForm; 