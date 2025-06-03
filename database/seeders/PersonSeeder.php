<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PersonSeeder extends Seeder
{
    public function run(): void
    {
        // Buscar um usuário existente
        $userId = DB::table('users')->where('id', 2)->first()?->id;

        if (!$userId) {
            $this->command->error('Nenhum usuário encontrado na tabela "users". Crie um primeiro.');
            return;
        }

        DB::table('person')->insert([
            'id' => $userId,
            'id_user' => $userId,
            'foto_perfil' => 'perfil1.jpg',
            'sobre' => 'Desenvolvedor web apaixonado por tecnologia.',
            'linkedin' => 'https://linkedin.com/in/exemplo',
            'instagram' => 'https://instagram.com/exemplo',
            'facebook' => 'https://facebook.com/exemplo',
            'cpf' => '123.456.789-00',
            'data_nascimento' => '1998-07-15',
            'genero' => 'Masculino',
            'deficiencia' => false,
            'qual_deficiencia' => null,
            'servico_militar' => 'true',
            'telefone' => '(48) 99999-8888',
            'rua' => 'Rua das Flores',
            'bairro' => 'Centro',
            'cidade' => 'Florianópolis',
            'estado' => 'SC',
            'numero' => '123',
            'complemento' => 'Apto 101',
            'cep' => '88000-000',
            'referencia' => 'Próximo à padaria',
            'estou_ciente' => 'true',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
