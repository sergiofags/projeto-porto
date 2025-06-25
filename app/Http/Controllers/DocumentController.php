<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Person;
use App\Models\Document;
use Dotenv\Exception\ValidationException;

class DocumentController extends Controller
{
    public function index(Request $request, $personId)
    {
        try {
            $person = Person::find($personId);
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada'
                ], 404);
            }

            $document = $person->document;
            return response()->json($document);

        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'Erro ao acessar o banco de dados.',
                'error' => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro interno no servidor.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request, $personId, $documentId)
    {
        try {
            $person = Person::find($personId);
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada'
                ], 404);
            }

            $document = $person->document()->find($documentId);
            if (!$document) {
                return response()->json([
                    'message' => 'Documento não encontrado'
                ], 404);
            }

            return response()->json($document);

        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'Erro ao acessar o banco de dados.',
                'error' => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro interno no servidor.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request, $personId)
    {
        try {
            $person = Person::find($personId);
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada'
                ], 404);
            }

            $validatedData = $request->validate([
                'tipo_documento' => 'required|in:Contratacao,Candidatura',
                'documento' => 'nullable|string|max:255',
                'nome_documento' => 'required|in:AtestadoMatricula,HistoricoEscolar,Curriculo,CoeficienteRendimento,Foto3x4,CedulaIdentidadeOuCNH,CadastroPessoaFisica,CTPS,CarteiraDeReservista,ComprovanteDeResidencia,AntecedentesCriminaisECivel,AntecedentesCriminaisPoliciaFederal,VacinacaFebreAmarela,VacinacaCovid19,GrupoSanguineo,ComprovanteMatricula,AtestadadoFrequencia',    
            ]);

            $validatedData['id_person'] = $person->id;

            // Precisa verificar pois não consegui converter o arquivo para path, irei corrigir posteriormente

            $document = Document::create($validatedData);

            return response()->json($document, 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação.',
                'error' => $e->getMessage()
            ], 422);

        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'Erro ao acessar o banco de dados.',
                'error' => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro interno no servidor.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $personId, $documentId)
    {
        try {
            $person = Person::find($personId);
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada'
                ], 404);
            }

            $document = $person->document()->find($documentId);
            if (!$document) {
                return response()->json([
                    'message' => 'Documento não encontrado'
                ], 404);
            }

            $validatedData = $request->validate([
                'tipo_documento' => 'required|in:Candidatura,Contratacao',
                'documento' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
                'nome_documento' => 'required|in:AtestadoMatricula,HistoricoEscolar,Curriculo,CoeficienteRendimento,Foto3x4,CedulaIdentidadeOuCNH,CadastroPessoaFisica,CTPS,CarteiraDeReservista,ComprovanteDeResidencia,AntecedentesCriminaisECivel,AntecedentesCriminaisPoliciaFederal,VacinacaFebreAmarela,VacinacaCovid19,GrupoSanguineo,ComprovanteMatricula,AtestadadoFrequencia',    
            ]);

            // Precisa verificar pois não consegui converter o arquivo para path, irei corrigir posteriormente

            $document->update($validatedData);

            return response()->json($document, 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação.',
                'error' => $e->getMessage()
            ], 422);

        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'Erro ao acessar o banco de dados.',
                'error' => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro interno no servidor.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
