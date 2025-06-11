import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Appartement, Batiment } from '../../types';

interface AppartementFormProps {
    appartement?: Appartement;
    onSuccess: () => void;
    onCancel: () => void;
}

const AppartementForm: React.FC<AppartementFormProps> = ({ appartement, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        numero: '',
        etage: 0,
        superficie: 0,
        prix: 0,
        batiment_id: 0,
        statut: 'libre' as 'libre' | 'occupe'
    });
    const [batiments, setBatiments] = useState<Batiment[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBatiments();
        if (appartement) {
            setFormData({
                numero: appartement.numero,
                etage: appartement.etage,
                superficie: appartement.superficie,
                prix: appartement.prix,
                batiment_id: appartement.batiment_id,
                statut: appartement.statut
            });
        }
    }, [appartement]);

    const fetchBatiments = async () => {
        try {
            const response = await axios.get('/api/batiments.php');
            setBatiments(response.data);
        } catch (err) {
            setError('Erreur lors du chargement des bâtiments');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (appartement) {
                await axios.put(`/api/appartements.php?id=${appartement.id}`, formData);
            } else {
                await axios.post('/api/appartements.php', formData);
            }
            onSuccess();
        } catch (err) {
            setError('Une erreur est survenue lors de l\'enregistrement');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['etage', 'superficie', 'prix', 'batiment_id'].includes(name) 
                ? parseInt(value) || 0 
                : value
        }));
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-lg font-medium mb-4">
                    {appartement ? 'Modifier l\'appartement' : 'Ajouter un appartement'}
                </h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
                                Numéro
                            </label>
                            <input
                                type="text"
                                name="numero"
                                id="numero"
                                required
                                value={formData.numero}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="etage" className="block text-sm font-medium text-gray-700">
                                Étage
                            </label>
                            <input
                                type="number"
                                name="etage"
                                id="etage"
                                required
                                min="0"
                                value={formData.etage}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="superficie" className="block text-sm font-medium text-gray-700">
                                Superficie (m²)
                            </label>
                            <input
                                type="number"
                                name="superficie"
                                id="superficie"
                                required
                                min="0"
                                value={formData.superficie}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="prix" className="block text-sm font-medium text-gray-700">
                                Prix (€)
                            </label>
                            <input
                                type="number"
                                name="prix"
                                id="prix"
                                required
                                min="0"
                                value={formData.prix}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="batiment_id" className="block text-sm font-medium text-gray-700">
                                Bâtiment
                            </label>
                            <select
                                name="batiment_id"
                                id="batiment_id"
                                required
                                value={formData.batiment_id}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Sélectionner un bâtiment</option>
                                {batiments.map(batiment => (
                                    <option key={batiment.id} value={batiment.id}>
                                        {batiment.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="statut" className="block text-sm font-medium text-gray-700">
                                Statut
                            </label>
                            <select
                                name="statut"
                                id="statut"
                                required
                                value={formData.statut}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="libre">Libre</option>
                                <option value="occupe">Occupé</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {appartement ? 'Modifier' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppartementForm; 