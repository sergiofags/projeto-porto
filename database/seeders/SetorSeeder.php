<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SetorSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('setores')->delete();

        DB::table('setores')->insert([
            ['nome' => 'T.I', 'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'Engenharia', 'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'Gestão', 'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'Comunicação e Design', 'created_at' => now(), 'updated_at' => now()],
            ['nome' => 'Segurança', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
