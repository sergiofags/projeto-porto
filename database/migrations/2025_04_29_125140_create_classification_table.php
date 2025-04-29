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
        Schema::create('classification', function (Blueprint $table) {
            $table->id();

            $table->foreignId('id_candidatura')->constrained('candidaturas');
            
            $table->float('nota_coeficiente_rendimento');
            $table->float('nota_entrevista');
            $table->enum('situacao', ['Habilitado', 'Inabilitado', 'Desclassificado']);
            $table->enum('motivo_situacao', ['Esperar RH']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classification');
    }
};