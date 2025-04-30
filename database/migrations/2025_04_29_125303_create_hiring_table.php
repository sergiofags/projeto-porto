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
        Schema::create('hiring', function (Blueprint $table) {
            $table->id();

            $table->foreignId('id_vacancy')->constrained('vacancy');
            $table->foreignId('id_person')->constrained('person');
            $table->foreignId('id_candidacy')->constrained('candidacy');
            $table->foreignId('id_classification')->constrained('classification');

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
        Schema::dropIfExists('hiring');
    }
};