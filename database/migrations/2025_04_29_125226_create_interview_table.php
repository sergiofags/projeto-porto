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
        Schema::create('interview', function (Blueprint $table) {
            $table->id();

            $table->foreignId('id_candidacy')->constrained('candidacy');
            $table->foreignId('id_admin')->constrained('users');

            $table->dateTime('data_hora');
            $table->enum('status', ['Cancelada', 'Agendada', 'Finalizada']);
            $table->string('localizacao');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interview');
    }
};