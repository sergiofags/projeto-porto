<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CandidacySeeder extends Seeder
{
    public function run(): void
    {
        $persons = DB::table('person')->get();
        $vacancy = DB::table('vacancy')->first();
        $process = DB::table('process')->first();

        if (!$vacancy || !$process) {
            $this->command->error('É necessário ter pelo menos um registro em vacancy e process.');
            return;
        }

        foreach ($persons as $person) {
            DB::table('candidacy')->insert([
                'id_person' => $person->id,
                'id_vacancy' => $vacancy->id,
                'id_process' => $process->id,
                'status' => 'Analise',
                'data_candidatura' => Carbon::now()->toDateString(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
