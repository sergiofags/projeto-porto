<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClassificationSeeder extends Seeder
{
    public function run(): void
    {
        $candidacies = DB::table('candidacy')->get();
        $admin = DB::table('users')->where('tipo_perfil', 'Admin')->first();

        if ($candidacies->isEmpty() || !$admin) {
            $this->command->error('É necessário ter candidaturas e pelo menos um administrador.');
            return;
        }

        foreach ($candidacies as $candidacy) {
            DB::table('classification')->insert([
                'id_candidacy' => $candidacy->id,
                'id_vacancy' => $candidacy->id_vacancy,
                'id_admin' => $admin->id,
                'nota_coeficiente_rendimento' => rand(60, 100) / 10, // Ex: 6.0 a 10.0
                'nota_entrevista' => rand(60, 100) / 10,
                'situacao' => 'Habilitado',
                'motivo_situacao' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
