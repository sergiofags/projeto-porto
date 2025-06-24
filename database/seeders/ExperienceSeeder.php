<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ExperienceSeeder extends Seeder
{
    public function run(): void
    {
        $people = DB::table('person')->get();

        if ($people->isEmpty()) {
            $this->command->error('Nenhum registro encontrado na tabela person.');
            return;
        }

        foreach ($people as $person) {
            DB::table('experience')->insert([
                [
                    'id_person' => $person->id,
                    'tipo_experiencia' => 'Acadêmica',
                    'status' => 'Cursando',
                    'empresa_instituicao' => 'Universidade Federal de Tecnologia',
                    'curso_cargo' => 'Sistemas para Internet',
                    'nivel' => 'Graduacao',
                    'atividades' => 'Desenvolvimento de sistemas web, participação em projetos de extensão.',
                    'semestre_modulo' => '5º Semestre',
                    'data_inicio' => Carbon::create(2022, 2, 1),
                    'data_fim' => null,
                    'emprego_atual' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id_person' => $person->id,
                    'tipo_experiencia' => 'Profissional',
                    'status' => null,
                    'empresa_instituicao' => 'Agência Criativa Ltda.',
                    'curso_cargo' => 'Desenvolvedor Frontend',
                    'nivel' => null,
                    'atividades' => 'Criação de sites e landing pages com HTML, CSS, JavaScript.',
                    'semestre_modulo' => null,
                    'data_inicio' => Carbon::create(2023, 6, 1),
                    'data_fim' => Carbon::create(2024, 3, 1),
                    'emprego_atual' => 'Não',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }
    }
}
