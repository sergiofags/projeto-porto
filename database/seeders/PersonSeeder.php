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
        $users = DB::table('users')->where('tipo_perfil', 'Candidato')->get();

        foreach ($users as $user) {
            DB::table('person')->insert([
                'id' => $user->id,
                'id_user' => $user->id,
                'foto_perfil' => "perfil{$user->id}.jpg",
                'sobre' => 'Candidato com experiência em tecnologia.',
                'linkedin' => "https://linkedin.com/in/candidato{$user->id}",
                'instagram' => "https://instagram.com/candidato{$user->id}",
                'facebook' => "https://facebook.com/candidato{$user->id}",
                'cpf' => sprintf('%03d.%03d.%03d-00', $user->id, $user->id, $user->id),
                'data_nascimento' => '1998-01-01',
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
}
