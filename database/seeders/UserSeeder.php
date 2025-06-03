<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@email.com',
            'password' => bcrypt('12345678'),
            'tipo_perfil' => 'Admin'
        ]);

        User::create([
            'name' => 'Candidato',
            'email' => 'candidato@email.com',
            'password' => bcrypt('12345678'),
            'tipo_perfil' => 'Candidato'
        ]);
    }
}
