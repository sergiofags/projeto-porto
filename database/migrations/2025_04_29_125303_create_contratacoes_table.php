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
        Schema::create('contratacoes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('id_vaga')->constrained('vagas');
            $table->foreignId('id_pessoa')->constrained('pessoas');
            $table->foreignId('id_candidatura')->constrained('candidaturas');
            $table->foreignId('id_classificacao')->constrained('classificacao');

            $table->date('data_contratacao');
            $table->date('data_exame');
            $table->string('professor_orientador');
            $table->string('registro_academico');
            $table->string('numero_contrato');
            $table->string('apolice_seguro');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contratacoes');
    }
};