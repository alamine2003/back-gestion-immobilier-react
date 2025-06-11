<?php
require_once __DIR__ . '/../config/database.php';

class Paiement {
    private $conn;
    private $table = 'paiements';

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    public function getAllByLocation($location_id) {
        $stmt = $this->conn->prepare('SELECT * FROM ' . $this->table . ' WHERE location_id = :location_id ORDER BY annee DESC, mois DESC');
        $stmt->bindParam(':location_id', $location_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $stmt = $this->conn->prepare('SELECT * FROM ' . $this->table . ' WHERE id = :id');
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        // Génération PDF quittance
        require_once __DIR__ . '/../vendor/autoload.php';
        $pdf = new \setasign\Fpdf\Fpdf();
        $pdf->AddPage();
        $pdf->SetFont('Arial','B',16);
        $pdf->Cell(0,10,'Quittance de loyer',0,1,'C');
        $pdf->SetFont('Arial','',12);
        $pdf->Ln(10);
        $pdf->Cell(0,10,'Locataire : '.$data['locataire_nom'].' '.$data['locataire_prenom'],0,1);
        $pdf->Cell(0,10,'Appartement : '.$data['appartement_numero'],0,1);
        $pdf->Cell(0,10,'Mois : '.$data['mois'].'/'.$data['annee'],0,1);
        $pdf->Cell(0,10,'Montant : '.$data['montant'].' F',0,1);
        $pdf->Cell(0,10,'Date de paiement : '.$data['date_paiement'],0,1);
        $pdf->Ln(10);
        $pdf->Cell(0,10,'Signature agence',0,1);
        $filename = 'quittances/quittance_'.uniqid().'.pdf';
        if (!is_dir(__DIR__.'/../quittances')) mkdir(__DIR__.'/../quittances');
        $pdf->Output('F', __DIR__.'/../'.$filename);
        $data['quittance_pdf'] = $filename;
        // Enregistrement en base
        $stmt = $this->conn->prepare('INSERT INTO ' . $this->table . ' (location_id, mois, annee, montant, date_paiement, quittance_pdf) VALUES (:location_id, :mois, :annee, :montant, :date_paiement, :quittance_pdf)');
        $stmt->bindParam(':location_id', $data['location_id']);
        $stmt->bindParam(':mois', $data['mois']);
        $stmt->bindParam(':annee', $data['annee']);
        $stmt->bindParam(':montant', $data['montant']);
        $stmt->bindParam(':date_paiement', $data['date_paiement']);
        $stmt->bindParam(':quittance_pdf', $data['quittance_pdf']);
        return $stmt->execute();
    }

    public function delete($id) {
        $stmt = $this->conn->prepare('DELETE FROM ' . $this->table . ' WHERE id = :id');
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function getAllByLocataire($locataire_id) {
        $sql = 'SELECT p.*, l.appartement_id, a.numero as appartement_numero, l.locataire_id, lo.nom as locataire_nom, lo.prenom as locataire_prenom
                FROM ' . $this->table . ' p
                JOIN locations l ON p.location_id = l.id
                JOIN locataires lo ON l.locataire_id = lo.id
                JOIN appartements a ON l.appartement_id = a.id
                WHERE l.locataire_id = :locataire_id
                ORDER BY p.annee DESC, p.mois DESC';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':locataire_id', $locataire_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAllByAppartement($appartement_id) {
        $sql = 'SELECT p.*, l.appartement_id, a.numero as appartement_numero, l.locataire_id, lo.nom as locataire_nom, lo.prenom as locataire_prenom
                FROM ' . $this->table . ' p
                JOIN locations l ON p.location_id = l.id
                JOIN locataires lo ON l.locataire_id = lo.id
                JOIN appartements a ON l.appartement_id = a.id
                WHERE l.appartement_id = :appartement_id
                ORDER BY p.annee DESC, p.mois DESC';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':appartement_id', $appartement_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
} 