import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Locataire } from '../../types';

interface LocataireFormProps {
    locataire?: Locataire;
    onSuccess: () => void;
    onCancel: () => void;
}

const LocataireForm: React.FC<LocataireFormProps> = ({ locataire, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: '',
        date_naissance: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (locataire) {
            setFormData({
                nom: locataire.nom,
                prenom: locataire.prenom,
                email: locataire.email,
                telephone: locataire.telephone,
                adresse: locataire.adresse,
                date_naissance: new Date(locataire.date_naissance).toISOString().split('T')[0]
            });
        }
    }, [locataire]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (locataire) {
                await axios.put(`/api/locataires.php?id=${locataire.id}`, formData);
            } else {
                await axios.post('/api/locataires.php', formData);
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
            [name]: value
        }));
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-lg font-medium mb-4">
                    {locataire ? 'Modifier le locataire' : 'Ajouter un locataire'}
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
                            <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                                Prénom
                            </label>
                            <input
                                type="text"
                                name="prenom"
                                id="prenom"
                                required
                                value={formData.prenom}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                name="telephone"
                                id="telephone"
                                required
                                value={formData.telephone}
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
                            <label htmlFor="date_naissance" className="block text-sm font-medium text-gray-700">
                                Date de naissance
                            </label>
                            <input
                                type="date"
                                name="date_naissance"
                                id="date_naissance"
                                required
                                value={formData.date_naissance}
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
                            {locataire ? 'Modifier' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LocataireForm; 