<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Usuário admin
        User::create([
            'name' => 'Admin',
            'email' => 'admin@email.com',
            'password' => bcrypt('12345678'),
            'tipo_perfil' => 'Admin'
        ]);

        // 10 usuários candidatos
        for ($i = 1; $i <= 10; $i++) {
            User::create([
                'name' => "Candidato {$i}",
                'email' => "candidato{$i}@email.com",
                'password' => bcrypt('12345678'),
                'tipo_perfil' => 'Candidato'
            ]);
        }
    }
}
