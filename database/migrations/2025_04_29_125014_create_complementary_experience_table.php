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
        Schema::create('complementary_experience', function (Blueprint $table) {
            $table->id();

            $table->foreignId('id_person')->constrained('person');

            $table->enum('tipo_experiencia', ['Idioma', 'Curso']);
            $table->string('titulo');
            $table->string('descricao')->nullable();
            $table->enum('nivel_idioma', ['Básico', 'Intermediário', 'Avançado', 'Fluente/Nativo'])->nullable();
            $table->string('certificado')->nullable();
            $table->date('data_inicio');
            $table->date('data_fim')->nullable();
            $table->string('instituicao');
            $table->enum('status', ['Cursando', 'Concluido']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complementary_experience');
    }
};