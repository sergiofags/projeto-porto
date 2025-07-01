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
                'tipo_vaga' => 'Graduacao',
                'status' => 'Aberto',
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
                'tipo_vaga' => 'Pos-Graduacao',
                'status' => 'Aberto',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_process' => $process->id,
                'id_admin' => $adminId,
                'titulo' => 'Vaga para Estágio em Desenvolvimento Frontend',
                'responsabilidades' => 'Desenvolver interfaces com React.js, colaborar com equipe de design e backend.',
                'requisitos' => 'Estar cursando ensino superior em áreas de TI. Conhecimento básico em HTML, CSS, JavaScript e React.',
                'carga_horaria' => '20h semanais',
                'remuneracao' => 1200.00,
                'beneficios' => 'Vale transporte, possibilidade de efetivação.',
                'quantidade' => 2,
                'tipo_vaga' => 'Graduacao',
                'status' => 'Aberto',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_process' => $process->id,
                'id_admin' => $adminId,
                'titulo' => 'Vaga para Bolsa de Pesquisa em Sustentabilidade Portuária',
                'responsabilidades' => 'Pesquisa sobre impacto ambiental, elaboração de relatórios técnicos e apoio a projetos sustentáveis.',
                'requisitos' => 'Estar matriculado em curso de Engenharia Ambiental, Biologia ou áreas afins.',
                'carga_horaria' => '30h semanais',
                'remuneracao' => 1800.00,
                'beneficios' => 'Auxílio pesquisa, acesso a laboratórios, vale transporte.',
                'quantidade' => 1,
                'tipo_vaga' => 'Graduacao',
                'status' => 'Aberto',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_process' => $process->id,
                'id_admin' => $adminId,
                'titulo' => 'Vaga para Residência em Segurança da Informação',
                'responsabilidades' => 'Monitoramento de sistemas, análise de vulnerabilidades, desenvolvimento de políticas de segurança.',
                'requisitos' => 'Curso superior em andamento ou completo em áreas de TI. Conhecimento básico em redes e segurança digital.',
                'carga_horaria' => '40h semanais',
                'remuneracao' => 3000.00,
                'beneficios' => 'Vale alimentação, plano de saúde, vale transporte.',
                'quantidade' => 1,
                'tipo_vaga' => 'Graduacao',
                'status' => 'Aberto',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
