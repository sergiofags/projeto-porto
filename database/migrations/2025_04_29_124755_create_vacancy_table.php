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
        Schema::create('vacancy', function (Blueprint $table) {
            $table->id();

            $table->foreignId('id_process')->constrained('process');
            $table->foreignId('id_admin')->constrained('users');

            $table->string('titulo');
            $table->text('responsabilidades')->nullable();
            $table->text('requisitos')->nullable();
            $table->string('carga_horaria');
            $table->float('remuneracao');
            $table->string('beneficios')->nullable();
            $table->integer('quantidade');
            $table->date('data_inicio');
            $table->date('data_fim');
            $table->enum('tipo_vaga', ['Graduacao', 'Pos-Graduacao']);
            $table->enum('status', ['Aberto', 'Fechado']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vacancy');
    }
};