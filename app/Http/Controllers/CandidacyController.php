<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Candidacy;
use App\Models\Person;
use App\Models\Vacancy;
use App\Models\Process;
use Dotenv\Exception\ValidationException;

class CandidacyController extends Controller
{
    public function allCandidacyByPerson($personId)
    {
        try {
            $person = Person::find($personId);
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada'
                ], 404);
            }

            $candidacy = $person->candidacy;
            return response()->json($candidacy);

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

    public function specificCandidacyByPerson($personId, $candidacyId)
    {
        try {
            $person = Person::find($personId);
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada'
                ], 404);
            }

            $candidacy = $person->candidacy()->find($candidacyId);
            if (!$candidacy) {
                return response()->json([
                    'message' => 'Candidatura não encontrada'
                ], 404);
            }

            return response()->json($candidacy);

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

    public function allCandidacyByVacancy($vacancyId)
    {
        try {
            $vacancy = Vacancy::find($vacancyId);
            if (!$vacancy) {
                return response()->json([
                    'message' => 'Vaga não encontrada'
                ], 404);
            }

            $candidacy = $vacancy->candidacy;
            return response()->json($candidacy);

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

    public function specificCandidacyByVacancy($vacancyId, $candidacyId)
    {
        try {
            $vacancy = Vacancy::find($vacancyId);
            if (!$vacancy) {
                return response()->json([
                    'message' => 'Vaga não encontrada'
                ], 404);
            }

            $candidacy = $vacancy->candidacy()->find($candidacyId);
            if (!$candidacy) {
                return response()->json([
                    'message' => 'Candidatura não encontrada'
                ], 404);
            }

            return response()->json($candidacy);

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

    public function store(Request $request, $personId, $vacancyId)
    {
        try {
            $person = Person::find($personId);
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada'
                ], 404);
            }

            $vacancy = Vacancy::find($vacancyId);
            if (!$vacancy) {
                return response()->json([
                    'message' => 'Vaga não encontrada'
                ], 404);
            }

            $process = Process::find($vacancy->id_process);
            if (!$process) {
                return response()->json([
                    'message' => 'Processo não encontrado'
                ], 404);
            }

            $validatedData = $request->validate([
                'status' => 'required|in:Cancelado,Analise,Completo',
                'data_candidatura' => 'required|date',
            ]);

            $existingCandidacy = Candidacy::where('id_person', $person->id)
                ->where('id_vacancy', $vacancy->id)
                ->first();

            if ($vacancy->data_fim < now()) {
                return response()->json(['message' => 'A vaga já foi encerrada'], 409);
            }

            if ($existingCandidacy) {
                return response()->json(['message' => 'Essa pessoa já possui uma candidatura para essa vaga'], 409);
            }

            $validatedData['id_person'] = $person->id;
            $validatedData['id_vacancy'] = $vacancy->id;
            $validatedData['id_process'] = $process->id;

            $candidacy = Candidacy::create($validatedData);

            return response()->json($candidacy, 201);
            
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

    public function update(Request $request, $personId, $candidacyId)
    {
        try {
            $person = Person::find($personId);
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada'
                ], 404);
            }

            $candidacy = $person->candidacy()->find($candidacyId);
            if (!$candidacy) {
                return response()->json([
                    'message' => 'Candidatura não encontrada'
                ], 404);
            }

            $validatedData = $request->validate([
                'status' => 'required|in:Cancelado,Analise,Completo',
                'data_candidatura' => 'required|date',
            ]);

            $candidacy->update($validatedData);

            return response()->json($candidacy);

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
