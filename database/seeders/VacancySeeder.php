<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class VacancySeeder extends Seeder
{
    public function run(): void
    {
        $adminId = DB::table('users')->where('id', 1)->first()?->id;
        $process = DB::table('process')->first();

        if (!$adminId || !$process) {
            $this->command->error('É necessário ter pelo menos um usuário e um processo na base de dados.');
            return;
        }

        DB::table('vacancy')->insert([
            [
                'id_process' => $process->id,
                'id_admin' => $adminId,
                'titulo' => 'Estágio em Desenvolvimento Web',
                'responsabilidades' => 'Desenvolver interfaces usando HTML, CSS, JavaScript e frameworks modernos.',
                'requisitos' => 'Cursando graduação em TI. Conhecimentos em Laravel e Vue.js são diferenciais.',
                'carga_horaria' => '20h semanais',
                'remuneracao' => 1200.00,
                'beneficios' => 'Vale transporte, seguro de vida.',
                'quantidade' => 2,
                'data_inicio' => Carbon::now()->toDateString(),
                'data_fim' => Carbon::now()->addDays(30)->toDateString(),
                'tipo_vaga' => 'Graduacao',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_process' => $process->id,
                'id_admin' => $adminId,
                'titulo' => 'Vaga para Pós-graduação em Ciência de Dados',
                'responsabilidades' => 'Análise de dados, criação de modelos preditivos, relatórios.',
                'requisitos' => 'Pós-graduação em andamento na área de dados. Conhecimento em Python e SQL.',
                'carga_horaria' => '30h semanais',
                'remuneracao' => 2500.00,
                'beneficios' => 'Vale alimentação, vale transporte.',
                'quantidade' => 1,
                'data_inicio' => Carbon::now()->addDays(5)->toDateString(),
                'data_fim' => Carbon::now()->addDays(35)->toDateString(),
                'tipo_vaga' => 'Pos-Graduacao',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
