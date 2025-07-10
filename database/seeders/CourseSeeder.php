<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('course')->delete();

        // Busca os IDs dos setores para associar aos cursos
        $setores = DB::table('setores')->pluck('id', 'nome');

        if ($setores->isEmpty()) {
            $this->command->error('Nenhum setor encontrado. Rode o SetorSeeder primeiro.');
            return;
        }

        $courses = [
            // Gestão
            ['nome' => 'ADMINISTRAÇÃO PÚBLICA', 'setor_id' => $setores['Gestão']],
            ['nome' => 'PROCESSOS GERENCIAIS', 'setor_id' => $setores['Gestão']],
            // Engenharia
            ['nome' => 'ENGENHARIA CIVIL', 'setor_id' => $setores['Engenharia']],
            ['nome' => 'ENGENHARIA ELÉTRICA', 'setor_id' => $setores['Engenharia']],
            ['nome' => 'ENGENHARIA DE PRODUÇÃO ELÉTRICA', 'setor_id' => $setores['Engenharia']],
            ['nome' => 'ENGENHARIA MECÂNICA', 'setor_id' => $setores['Engenharia']],
            ['nome' => 'ENGENHARIA NAVAL', 'setor_id' => $setores['Engenharia']],
            // Comunicação e Design
            ['nome' => 'DESIGN', 'setor_id' => $setores['Comunicação e Design']],
            ['nome' => 'JORNALISMO', 'setor_id' => $setores['Comunicação e Design']],
            ['nome' => 'PRODUÇÃO AUDIOVISUAL', 'setor_id' => $setores['Comunicação e Design']],
            ['nome' => 'PUBLICIDADE E PROPAGANDA', 'setor_id' => $setores['Comunicação e Design']],
            // Segurança
            ['nome' => 'TECNÓLOGO EM SEGURANÇA DO TRABALHO', 'setor_id' => $setores['Segurança']],
            // T.I.
            ['nome' => 'CIÊNCIA DA COMPUTAÇÃO', 'setor_id' => $setores['T.I']],
            ['nome' => 'ENGENHARIA DA COMPUTAÇÃO', 'setor_id' => $setores['T.I']],
            ['nome' => 'SISTEMAS DE INFORMAÇÃO', 'setor_id' => $setores['T.I']],
            ['nome' => 'TECNOLOGIA EM REDE DE COMPUTADORES', 'setor_id' => $setores['T.I']],
            ['nome' => 'TECNOLOGIA EM GESTÃO DE TI', 'setor_id' => $setores['T.I']],
            ['nome' => 'TECNOLOGIA EM INFORMÁTICA', 'setor_id' => $setores['T.I']],
            ['nome' => 'TECNOLOGIA EM ANÁLISE E DESENVOLVIMENTO DE SISTEMAS', 'setor_id' => $setores['T.I']],
            ['nome' => 'TECNOLOGIA EM SISTEMAS PARA INTERNET', 'setor_id' => $setores['T.I']],
        ];

        // Adiciona timestamps a todos os cursos
        foreach ($courses as &$course) {
            $course['created_at'] = now();
            $course['updated_at'] = now();
        }

        DB::table('course')->insert($courses);
    }
}
