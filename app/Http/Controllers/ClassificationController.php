<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Candidacy;
use App\Models\Classification;
use App\Models\Vacancy;
use App\Models\Process;
Use App\Models\User;

class ClassificationController extends Controller
{
    public function index($vacancyId)
    {
        try {
            $vacancy = Vacancy::find($vacancyId);
            if (!$vacancy) {
                return response()->json([
                    'message' => 'Vaga não encontrada.'
                ], 404);
            }

            $classification = $vacancy->classification;

            foreach ($classification as $item) {
                $item->nota_final = $item->nota_entrevista + $item->nota_historico;
            }

            $classification = $classification->sortByDesc('nota_final')->values();

            return response()->json($classification);

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

    public function showByCandidacy($vacancyId, $candidacyId)
    {
        try {
            $vacancy = Vacancy::find($vacancyId);
            if (!$vacancy) {
                return response()->json([
                    'message' => 'Vaga não encontrada.'
                ], 404);
            }

            $candidacy = Candidacy::find($candidacyId);
            if (!$candidacy) {
                return response()->json([
                    'message' => 'Candidatura não encontrada.'
                ], 404);
            }

            $classification = $vacancy->classification->where('id_candidacy', $candidacyId)->first();
            if (!$classification) {
                return response()->json([
                    'message' => 'Classificação não encontrada para a candidatura especificada.'
                ], 404);
            }

            return response()->json($classification);

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

    public function store(Request $request, $candidacyId, $adminId)
    {
        try {
            $admin = User::where('id', $adminId)->where('tipo_perfil', 'Admin')->first();
            if (!$admin) {
                return response()->json([
                    'message' => 'Administrador não encontrado ou não possui perfil de Admin.'
                ], 404);
            }

            $candidacy = Candidacy::find($candidacyId);
            if (!$candidacy) {
                return response()->json([
                    'message' => 'Candidatura não encontrada.'
                ], 404);
            }

            $validatedData = $request->validate([
                'nota_coeficiente_rendimento' => 'nullable|string|min:0|max:10',
                'nota_entrevista' => 'nullable|string|min:0|max:10',
                'situacao' => 'nullable|in:Habilitado,Inabilitado,Desclassificado',
                'motivo_situacao' => 'nullable|string|max:255',
            ]);

            $validatedData['id_candidacy'] = $candidacy->id;
            $validatedData['id_vacancy'] = $candidacy->id_vacancy;

            $validatedData['situacao'] = $validatedData['situacao'] ?? 'Habilitado';
            $validatedData['motivo_situacao'] = $validatedData['motivo_situacao'] ?? 'Esperar RH';

            $coeficienteRendimento = $validatedData['nota_coeficiente_rendimento'] ?? null;

            if ($coeficienteRendimento <= 5) {
                $notaHistorico = 5;
            }
            if ($coeficienteRendimento > 5 && $coeficienteRendimento <= 7) {
                $notaHistorico = 15;
            }
            if ($coeficienteRendimento > 7 && $coeficienteRendimento <= 8) {
                $notaHistorico = 25;
            }
            if ($coeficienteRendimento > 8 && $coeficienteRendimento <= 9) {
                $notaHistorico = 35;
            }
            if ($coeficienteRendimento > 9 && $coeficienteRendimento <= 10) {
                $notaHistorico = 50;
            }

            $validatedData['nota_historico'] = $notaHistorico;
            $validatedData['id_admin'] = $adminId;

            $classification = Classification::create($validatedData);

            return response()->json($classification, 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação.',
                'error' => $e->error()
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

    public function updateNote(Request $request, $candidacyId, $classificationId, $adminId)
    {
        try {
            $admin = User::where('id', $adminId)->where('tipo_perfil', 'Admin')->first();
            if (!$admin) {
                return response()->json([
                    'message' => 'Administrador não encontrado ou não possui perfil de Admin.'
                ], 404);
            }

            $candidacy = Candidacy::find($candidacyId);
            if (!$candidacy) {
                return response()->json([
                    'message' => 'Candidatura não encontrada.'
                ], 404);
            }

            $classification = Classification::find($classificationId);
            if (!$classification) {
                return response()->json([
                    'message' => 'Classificação não encontrada.'
                ], 404);
            }

            $validatedData = $request->validate([
                'nota_coeficiente_rendimento' => 'nullable|string|min:0|max:10',
                'nota_entrevista' => 'nullable|string|min:0|max:10',
                'situacao' => 'nullable|in:Habilitado,Inabilitado,Desclassificado',
                'motivo_situacao' => 'nullable|string|max:255',
            ]);

            $coeficienteRendimento = $validatedData['nota_coeficiente_rendimento'] ?? null;

            if ($coeficienteRendimento <= 5) {
                $notaHistorico = 5;
            }
            if ($coeficienteRendimento > 5 && $coeficienteRendimento <= 7) {
                $notaHistorico = 15;
            }
            if ($coeficienteRendimento > 7 && $coeficienteRendimento <= 8) {
                $notaHistorico = 25;
            }
            if ($coeficienteRendimento > 8 && $coeficienteRendimento <= 9) {
                $notaHistorico = 35;
            }
            if ($coeficienteRendimento > 9 && $coeficienteRendimento <= 10) {
                $notaHistorico = 50;
            }

            $validatedData['nota_historico'] = $notaHistorico;
            $validatedData['id_admin'] = $adminId;

            $classification->update($validatedData);

            return response()->json($classification);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação.',
                'error' => $e->error()
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