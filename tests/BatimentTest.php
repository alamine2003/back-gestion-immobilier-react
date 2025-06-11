<?php
use PHPUnit\Framework\TestCase;
require_once __DIR__ . '/../models/Batiment.php';

class BatimentTest extends TestCase
{
    public function testCreateAndGet()
    {
        $batiment = new Batiment();
        $data = [
            'nom' => 'Test Immeuble',
            'adresse' => '123 rue test',
            'nb_appartements' => 5,
            'proprietaire' => 'Test Proprio',
            'agence_id' => null
        ];
        $batiment->create($data);
        $all = $batiment->getAll();
        $this->assertNotEmpty($all);
    }
} 