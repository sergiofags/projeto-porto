<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClassificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('classification')->insert([
            [
                'id_candidacy' => 1,
                'id_vacancy' => 1,
                'id_admin' => 1,
                'nota_coeficiente_rendimento' => 0,
                'nota_entrevista' => 0,
                'situacao' => 'Habilitado',
                'motivo_situacao' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
