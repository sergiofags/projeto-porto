<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Person;
use App\Models\Document;

class DocumentController extends Controller
{
    public function index(Request $request, $personId)
    {
        $person = Person::findOrFail($personId);
        $document = $person->document;
        return response()->json($document);
    }

    public function show(Request $request, $personId, $documentId)
    {
        $person = Person::findOrFail($personId);
        $document = $person->document()->findOrFail($documentId);
        return response()->json($document);
    }

    public function store(Request $request, $personId)
    {
        $person = Person::findOrFail($personId);

        $validatedData = $request->validate([
            'tipo_documento' => 'required|in:Contratacao,Candidatura',
            'documento' => 'nullable|string|max:255',
            'nome_documento' => 'required|in:AtestadoMatricula,HistoricoEscolar,Curriculo,CoeficienteRendimento,Foto3x4,CedulaIdentidadeOuCNH,CadastroPessoaFisica,CTPS,CarteiraDeReservista,ComprovanteDeResidencia,AntecedentesCriminaisECivel,AntecedentesCriminaisPoliciaFederal,VacinacaFebreAmarela,VacinacaCovid19,GrupoSanguineo,ComprovanteMatricula,AtestadadoFrequencia',    
        ]);

        $validatedData['id_person'] = $person->id;

        // Precisa verificar pois não consegui converter o arquivo para path, irei corrigir posteriormente

        $document = Document::create($validatedData);

        return response()->json($document, 201);
    }

    public function update(Request $request, $personId, $documentId)
    {
        $person = Person::findOrFail($personId);
        $document = $person->document()->findOrFail($documentId);

        $validatedData = $request->validate([
            'tipo_documento' => 'required|in:Candidatura,Contratacao',
            'documento' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'nome_documento' => 'required|in:AtestadoMatricula,HistoricoEscolar,Curriculo,CoeficienteRendimento,Foto3x4,CedulaIdentidadeOuCNH,CadastroPessoaFisica,CTPS,CarteiraDeReservista,ComprovanteDeResidencia,AntecedentesCriminaisECivel,AntecedentesCriminaisPoliciaFederal,VacinacaFebreAmarela,VacinacaCovid19,GrupoSanguineo,ComprovanteMatricula,AtestadadoFrequencia',    
        ]);

        // Precisa verificar pois não consegui converter o arquivo para path, irei corrigir posteriormente

        $document->update($validatedData);

        return response()->json($document, 200);
    }

    public function allDocumentByType(Request $request, $personId, $typeDocument)
    {
        $person = Person::findOrFail($personId);

        $documents = $person->document()->where('tipo_documento', $typeDocument)->get();
        return response()->json($documents);
    }

}
