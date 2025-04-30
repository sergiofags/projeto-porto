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
        Schema::create('document', function (Blueprint $table) {
            $table->id();

            $table->foreignId('id_person')->constrained('person');

            $table->enum('tipo_documento', ['Candidatura', 'Contratacao']);
            $table->string('documento')->nullable();
            
            $table->enum('nome_documento', ['AtestadoMatricula', 'HistoricoEscolar', 'Curriculo', 'CoeficienteRendimento', 'Foto3x4', 'CedulaIdentidadeOuCNH', 'CadastroPessoaFisica', 'CTPS', 'CarteiraDeReservista', 'ComprovanteDeResidencia', 'AntecedentesCriminaisECivel', 'AntecedentesCriminaisPoliciaFederal', 'VacinacaFebreAmarela', 'VacinacaCovid19', 'GrupoSanguineo', 'ComprovanteMatricula', 'AtestadadoFrequencia']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document');
    }
};