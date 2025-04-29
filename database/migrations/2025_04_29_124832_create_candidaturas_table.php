<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('candidaturas', function (Blueprint $table) {
            $table->id();

            $table->foreignId('id_pessoa')->constrained('pessoas');
            $table->foreignId('id_vaga')->constrained('vagas');
            
            $table->enum('status', ['Cancelado', 'Analise', 'Completo']);
            $table->date('data_candidatura');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidaturas');
    }
};