export interface User {
    id: number;
    email: string;
    nom: string;
    prenom: string;
    role: 'admin' | 'user';
}

export interface Batiment {
    id: number;
    nom: string;
    adresse: string;
    ville: string;
    code_postal: string;
    nombre_appartements: number;
}

export interface Appartement {
    id: number;
    numero: string;
    etage: number;
    surface: number;
    prix: number;
    batiment_id: number;
    batiment?: Batiment;
    statut: 'libre' | 'occupe';
}

export interface Locataire {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    date_naissance: string;
    date_entree: string;
    date_sortie?: string;
}

export interface Location {
    id: number;
    appartement_id: number;
    locataire_id: number;
    date_debut: string;
    date_fin?: string;
    loyer: number;
    caution: number;
    appartement?: Appartement;
    locataire?: Locataire;
}

export interface Paiement {
    id: number;
    location_id: number;
    montant: number;
    date_paiement: string;
    type_paiement: 'loyer' | 'caution' | 'autre';
    statut: 'en_attente' | 'valide' | 'refuse';
    location?: Location;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: User;
    message?: string;
} 