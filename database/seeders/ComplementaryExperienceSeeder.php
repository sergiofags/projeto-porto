<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ComplementaryExperienceSeeder extends Seeder
{
    public function run(): void
    {
        $people = DB::table('person')->get();

        if ($people->isEmpty()) {
            $this->command->error('Nenhum registro encontrado na tabela person.');
            return;
        }

        foreach ($people as $person) {
            DB::table('complementary_experience')->insert([
                [
                    'id_person' => $person->id,
                    'tipo_experiencia' => 'Idioma',
                    'titulo' => 'Inglês',
                    'descricao' => 'Curso de inglês com foco em conversação.',
                    'nivel_idioma' => 'Intermediário',
                    'certificado' => 'certificado_ingles.pdf',
                    'data_inicio' => Carbon::create(2021, 1, 10),
                    'data_fim' => Carbon::create(2022, 12, 10),
                    'instituicao' => 'Wizard Idiomas',
                    'status' => 'Concluido',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id_person' => $person->id,
                    'tipo_experiencia' => 'Curso',
                    'titulo' => 'Laravel para Iniciantes',
                    'descricao' => 'Curso completo de desenvolvimento web com Laravel.',
                    'nivel_idioma' => null,
                    'certificado' => 'certificado_laravel.pdf',
                    'data_inicio' => Carbon::create(2023, 5, 1),
                    'data_fim' => null,
                    'instituicao' => 'Alura',
                    'status' => 'Cursando',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }
    }
}
