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

            $table->foreignId('id_candidacy')->constrained('candidacy');
            $table->foreignId('id_vacancy')->constrained('vacancy');
            $table->foreignId('id_admin')->constrained('users');
            
            $table->string('nota_coeficiente_rendimento')->nullable();
            $table->string('nota_entrevista')->nullable();
            $table->string('nota_historico')->nullable();
            $table->enum('situacao', ['Habilitado', 'Inabilitado', 'Desclassificado']);
            $table->string('motivo_situacao')->nullable();

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