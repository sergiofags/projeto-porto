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
        Schema::create('person', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            
            $table->foreignId('id_user')->constrained('users');

            $table->string('foto_perfil')->nullable();
            $table->string('sobre')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('instagram')->nullable();
            $table->string('facebook')->nullable();
            $table->string('twitter')->nullable();
            $table->string('cpf')->unique()->nullable();
            $table->date('data_nascimento')->nullable();
            $table->enum('genero', ['Masculino', 'Feminino', 'Outro'])->nullable();
            $table->boolean('deficiencia', ['true', 'false'])->nullable();
            $table->string('qual_deficiencia')->nullable();
            $table->enum('servico_militar', ['true', 'false'])->nullable();
            $table->string('telefone')->nullable();
            $table->string('rua')->nullable();
            $table->string('bairro')->nullable();
            $table->string('cidade')->nullable();
            $table->string('estado')->nullable();
            $table->string('numero')->nullable();
            $table->string('complemento')->nullable();
            $table->string('cep')->nullable();
            $table->string('referencia')->nullable();
            $table->enum('estou_ciente', ['true', 'false'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('person');
    }
};