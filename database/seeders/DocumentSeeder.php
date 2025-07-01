<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DocumentSeeder extends Seeder
{
    public function run(): void
    {
        $person = DB::table('person')->where('id_user', 2)->first();

        if (!$person) {
            $this->command->error('Nenhum registro encontrado na tabela person.');
            return;
        }

        DB::table('document')->insert([
            [
                'id_person' => $person->id,
                'tipo_documento' => 'Candidatura',
                'documento' => 'curriculo.pdf',
                'nome_documento' => 'Curriculo',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_person' => $person->id,
                'tipo_documento' => 'Contratacao',
                'documento' => 'cnh.pdf',
                'nome_documento' => 'CedulaIdentidadeOuCNH',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_person' => $person->id,
                'tipo_documento' => 'Contratacao',
                'documento' => 'cpf.pdf',
                'nome_documento' => 'CadastroPessoaFisica',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
