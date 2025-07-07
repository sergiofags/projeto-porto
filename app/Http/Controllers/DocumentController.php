<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Person;
use App\Models\Document;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class DocumentController extends Controller
{
    public function index(Request $request, $personId)
    {
        try {
            // Primeiro, tenta encontrar a pessoa pelo ID direto
            $person = Person::find($personId);
            
            // Se não encontrar, tenta encontrar pelo id_user
            if (!$person) {
                $person = Person::where('id_user', $personId)->first();
            }
            
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada'
                ], 404);
            }

            $documents = $person->document; // Retorna a collection de documentos
            return response()->json($documents);

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
            // Primeiro, tenta encontrar a pessoa pelo ID direto
            $person = Person::find($personId);
            
            // Se não encontrar, tenta encontrar pelo id_user
            if (!$person) {
                $person = Person::where('id_user', $personId)->first();
            }
            
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada'
                ], 404);
            }

            $validatedData = $request->validate([
                'tipo_documento' => 'required|in:Candidatura,Contratacao',
                'documento' => 'required|file|mimes:pdf|max:20480', // 20MB e só PDF
                'nome_documento' => 'required|in:AtestadoMatricula,HistoricoEscolar,Curriculo,CoeficienteRendimento',
            ]);

            $validatedData['id_person'] = $person->id;

            // Cria a pasta do candidato se não existir
            $userId = $person->id_user ?? $person->id;
            $folder = "Documentos_Candidato/Candidato{$userId}";
            Storage::disk('public')->makeDirectory($folder); // Garante a criação da pasta

            if ($request->hasFile('documento')) {
                $file = $request->file('documento');
                
                // Mapear nomes dos documentos para nomes de arquivo
                $nomeArquivoMap = [
                    'AtestadoMatricula' => 'Atestado_de_matricula',
                    'HistoricoEscolar' => 'Historico_escolar',
                    'Curriculo' => 'Curriculo',
                    'CoeficienteRendimento' => 'Coeficiente_de_rendimento'
                ];
                
                $nomeDocumento = $validatedData['nome_documento'];
                $nomeArquivo = $nomeArquivoMap[$nomeDocumento] ?? $nomeDocumento;
                $extensao = $file->getClientOriginalExtension();
                $nomeCompleto = $nomeArquivo . '.' . $extensao;
                
                $path = $file->storeAs($folder, $nomeCompleto, 'public');
                $validatedData['documento'] = $path;
            } else {
                return response()->json([
                    'message' => 'Arquivo não enviado.'
                ], 422);
            }

            $document = Document::create($validatedData);

            return response()->json($document, 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação.',
                'error' => $e->getMessage()
            ], 422);

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
            // Primeiro, tenta encontrar a pessoa pelo ID direto
            $person = Person::find($personId);
            
            // Se não encontrar, tenta encontrar pelo id_user
            if (!$person) {
                $person = Person::where('id_user', $personId)->first();
            }
            
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada'
                ], 404);
            }

            // Buscar o documento específico da pessoa
            $document = Document::where('id', $documentId)
                              ->where('id_person', $person->id)
                              ->first();
            if (!$document) {
                return response()->json([
                    'message' => 'Documento não encontrado'
                ], 404);
            }

            $validatedData = $request->validate([
                'tipo_documento' => 'required|in:Candidatura,Contratacao',
                'documento' => 'nullable|file|mimes:pdf|max:20480', // 20MB e só PDF
                'nome_documento' => 'nullable|in:AtestadoMatricula,HistoricoEscolar,Curriculo,CoeficienteRendimento',    
            ]);

            // Se um novo arquivo foi enviado, processar o upload
            if ($request->hasFile('documento')) {
                $file = $request->file('documento');
                
                // Mapear nomes dos documentos para nomes de arquivo
                $nomeArquivoMap = [
                    'AtestadoMatricula' => 'Atestado_de_matricula',
                    'HistoricoEscolar' => 'Historico_escolar',
                    'Curriculo' => 'Curriculo',
                    'CoeficienteRendimento' => 'Coeficiente_de_rendimento'
                ];
                
                // Usar o nome_documento fornecido ou manter o existente
                $nomeDocumento = $validatedData['nome_documento'] ?? $document->nome_documento;
                $nomeArquivo = $nomeArquivoMap[$nomeDocumento] ?? $nomeDocumento;
                $extensao = $file->getClientOriginalExtension();
                $nomeCompleto = $nomeArquivo . '.' . $extensao;
                
                // Criar pasta se necessário
                $userId = $person->id_user ?? $person->id;
                $folder = "Documentos_Candidato/Candidato{$userId}";
                Storage::disk('public')->makeDirectory($folder);
                
                // Deletar arquivo antigo se existir
                if ($document->documento && Storage::disk('public')->exists($document->documento)) {
                    Storage::disk('public')->delete($document->documento);
                }
                
                $path = $file->storeAs($folder, $nomeCompleto, 'public');
                $validatedData['documento'] = $path;
            }

            $document->update($validatedData);

            return response()->json($document, 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
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
            // Log detalhado do erro para debug
            Log::error('Erro ao atualizar documento:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Erro interno no servidor.',
                'error' => $e->getMessage(),
                'debug' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ], 500);
        }
    }
}
