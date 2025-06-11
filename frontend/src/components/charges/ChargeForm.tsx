import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../utils/axios';
import { Charge } from '../../types';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import { useToast } from '../ui/ToastContainer';

interface ChargeFormProps {
    charge?: Charge;
    onSuccess: () => void;
    onCancel: () => void;
}

const ChargeForm: React.FC<ChargeFormProps> = ({ charge, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        type: charge?.type || '',
        description: charge?.description || '',
        montant: charge?.montant || '',
        date: charge?.date ? new Date(charge.date).toISOString().split('T')[0] : '',
        reference: charge?.reference || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = charge
                ? await api.put<Charge>(`/charges/${charge.id}`, formData)
                : await api.post<Charge>('/charges', formData);

            if (response.success) {
                onSuccess();
            }
        } catch (err) {
            setError('Erreur lors de l\'enregistrement de la charge');
            showToast('error', 'Erreur lors de l\'enregistrement de la charge');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
            <Card className="w-full max-w-2xl">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {charge ? 'Modifier la charge' : 'Nouvelle charge'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Sélectionner un type</option>
                                <option value="taxe">Taxe</option>
                                <option value="entretien">Entretien</option>
                                <option value="assurance">Assurance</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={3}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
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
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
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
                                placeholder="Numéro de facture, référence..."
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
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
                                {loading ? 'Enregistrement...' : (charge ? 'Modifier' : 'Ajouter')}
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </motion.div>
    );
};

export default ChargeForm; 