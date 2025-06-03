<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ProcessSeeder extends Seeder
{
    public function run(): void
    {

        $adminId = DB::table('users')->where('id', 1)->first()?->id;

        if (!$adminId) {
            $this->command->error('Nenhum usuário encontrado na tabela "users". Crie um primeiro.');
            return;
        }

        DB::table('process')->insert([
            [
                'id_admin' => $adminId,
                'descricao' => 'Processo seletivo para contratação de estagiário TI',
                'status' => 'Aberto',
                'numero_processo' => 'PROC-'.Str::random(5),
                'edital' => 'edital_selecao_2025.pdf',
                'data_inicio' => Carbon::now()->toDateString(),
                'data_fim' => Carbon::now()->addDays(30)->toDateString(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_admin' => $adminId,
                'descricao' => 'Processo seletivo para contratação de estagiário Licitações',
                'status' => 'Pendente',
                'numero_processo' => 'PROC-'.Str::random(5),
                'edital' => 'edital_selecao_2025.pdf',
                'data_inicio' => Carbon::now()->subDays(10)->toDateString(),
                'data_fim' => Carbon::now()->addDays(20)->toDateString(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
