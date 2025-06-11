import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Batiment } from '../../types';

interface BatimentFormProps {
    batiment?: Batiment;
    onSuccess: () => void;
    onCancel: () => void;
}

const BatimentForm: React.FC<BatimentFormProps> = ({ batiment, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        nom: '',
        adresse: '',
        nombre_etages: 0,
        nombre_appartements: 0
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (batiment) {
            setFormData({
                nom: batiment.nom,
                adresse: batiment.adresse,
                nombre_etages: batiment.nombre_etages,
                nombre_appartements: batiment.nombre_appartements
            });
        }
    }, [batiment]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (batiment) {
                await axios.put(`/api/batiments.php?id=${batiment.id}`, formData);
            } else {
                await axios.post('/api/batiments.php', formData);
            }
            onSuccess();
        } catch (err) {
            setError('Une erreur est survenue lors de l\'enregistrement');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('nombre') ? parseInt(value) || 0 : value
        }));
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-lg font-medium mb-4">
                    {batiment ? 'Modifier le bâtiment' : 'Ajouter un bâtiment'}
                </h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                                Nom
                            </label>
                            <input
                                type="text"
                                name="nom"
                                id="nom"
                                required
                                value={formData.nom}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                                Adresse
                            </label>
                            <input
                                type="text"
                                name="adresse"
                                id="adresse"
                                required
                                value={formData.adresse}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="nombre_etages" className="block text-sm font-medium text-gray-700">
                                Nombre d'étages
                            </label>
                            <input
                                type="number"
                                name="nombre_etages"
                                id="nombre_etages"
                                required
                                min="0"
                                value={formData.nombre_etages}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="nombre_appartements" className="block text-sm font-medium text-gray-700">
                                Nombre d'appartements
                            </label>
                            <input
                                type="number"
                                name="nombre_appartements"
                                id="nombre_appartements"
                                required
                                min="0"
                                value={formData.nombre_appartements}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
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
                            {batiment ? 'Modifier' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BatimentForm; 