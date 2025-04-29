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
        Schema::create('pessoas', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('id_user')->constrained('users');

            $table->string('nome');
            $table->string('foto_perfil')->nullable();
            $table->string('sobre')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('cpf')->unique();
            $table->date('data_nascimento');
            $table->enum('genero', ['Masculino', 'Feminino', 'Outro']);
            $table->boolean('deficiencia')->default(false);
            $table->boolean('servico_militar')->default(false);
            $table->string('telefone');
            $table->string('rua')->nullable();
            $table->string('bairro')->nullable();
            $table->string('cidade')->nullable();
            $table->string('estado')->nullable();
            $table->string('numero')->nullable();
            $table->string('complemento')->nullable();
            $table->string('cep')->nullable();
            $table->string('referencia')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pessoas');
    }
};