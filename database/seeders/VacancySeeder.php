<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VacancySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('vacancy')->delete(); // Limpa vagas antigas
        DB::table('course_vacancy')->delete(); // Limpa associações antigas

        $adminId = DB::table('users')->where('id', 1)->value('id');
        $processId = DB::table('process')->value('id');

        if (!$adminId || !$processId) {
            $this->command->error('É necessário ter um usuário admin e um processo no banco.');
            return;
        }

        // --- VAGA 1: ESTÁGIO EM DESENVOLVIMENTO (PARA TODOS OS CURSOS DE T.I) ---

        // 1. Cria a vaga e pega o ID dela
        $devVacancyId = DB::table('vacancy')->insertGetId([
            'id_process' => $processId,
            'id_admin' => $adminId,
            'titulo' => 'Estágio em Desenvolvimento de Software',
            'responsabilidades' => 'Desenvolver e manter aplicações web, colaborar com a equipe de produto.',
            'requisitos' => 'Cursando ensino superior em áreas de Tecnologia da Informação. Lógica de programação e conhecimento em Git.',
            'carga_horaria' => '30h semanais',
            'remuneracao' => 1500.00,
            'beneficios' => 'Vale transporte, vale refeição, seguro de vida.',
            'quantidade' => 5,
            'status' => 'Aberto',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Busca todos os cursos do setor 'T.I'
        $tiCourses = DB::table('course')->where('setor', 'T.I')->pluck('id');

        // 3. Associa a vaga a todos os cursos de T.I
        foreach ($tiCourses as $courseId) {
            DB::table('course_vacancy')->insert([
                'vacancy_id' => $devVacancyId,
                'course_id' => $courseId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        $this->command->info("Vaga 'Estágio em Desenvolvimento' criada e associada a " . $tiCourses->count() . " cursos de T.I.");


        // --- VAGA 2: ENGENHARIA (PARA TODOS OS CURSOS DE ENGENHARIA) ---

        // 1. Cria a vaga de engenharia
        $engVacancyId = DB::table('vacancy')->insertGetId([
            'id_process' => $processId,
            'id_admin' => $adminId,
            'titulo' => 'Estágio em Engenharia',
            'responsabilidades' => 'Apoiar no desenvolvimento de projetos, elaboração de relatórios técnicos e acompanhamento de obras.',
            'requisitos' => 'Cursando ensino superior em qualquer área de Engenharia a partir do 5º período.',
            'carga_horaria' => '30h semanais',
            'remuneracao' => 1600.00,
            'beneficios' => 'Vale transporte, seguro de vida.',
            'quantidade' => 3,
            'status' => 'Aberto',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Busca todos os cursos do setor 'Engenharia'
        $engCourses = DB::table('course')->where('setor', 'Engenharia')->pluck('id');

        // 3. Associa a vaga a todos os cursos de Engenharia
        foreach ($engCourses as $courseId) {
            DB::table('course_vacancy')->insert([
                'vacancy_id' => $engVacancyId,
                'course_id' => $courseId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        $this->command->info("Vaga 'Estágio em Engenharia' criada e associada a " . $engCourses->count() . " cursos de Engenharia.");
    }
}
