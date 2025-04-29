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
        Schema::create('processos', function (Blueprint $table) {
            $table->id();

            $table->foreignId('id_vaga')->constrained('vagas');
            $table->foreignId('id_candidatura')->constrained('candidaturas');

            $table->enum('status', ['Pendente', 'Aberto', 'Fechado']);
            $table->date('data_inicio');
            $table->date('data_fim');
            $table->string('numero_processo')->unique();
            $table->string('edital');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('processos');
    }
};