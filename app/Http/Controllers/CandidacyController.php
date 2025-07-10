<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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

            // Verifica se a pessoa já tem candidatura em qualquer vaga
            $existingCandidacy = Candidacy::where('id_person', $person->id)->first();

            if ($existingCandidacy) {
                $existingVacancy = Vacancy::find($existingCandidacy->id_vacancy);
                return response()->json([
                    'message' => 'Você já se candidatou em uma vaga',
                    'vacancy_title' => $existingVacancy ? $existingVacancy->titulo : 'Vaga não encontrada'
                ], 409);
            }

            if ($vacancy->data_fim && $vacancy->data_fim < now()) {
                return response()->json(['message' => 'A vaga já foi encerrada'], 409);
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

    public function cancel(Request $request, $personId, $candidacyId)
    {
        try {
            Log::info('=== INÍCIO DO CANCELAMENTO ===');
            Log::info('PersonId recebido: ' . $personId);
            Log::info('CandidacyId recebido: ' . $candidacyId);
            Log::info('Request data: ' . json_encode($request->all()));
            
            Log::info('Tentativa de cancelamento - PersonId: ' . $personId . ', CandidacyId: ' . $candidacyId);
            
            // Primeiro, tenta encontrar a pessoa pelo ID direto
            $person = Person::find($personId);
            Log::info('Busca por Person::find(' . $personId . '): ' . ($person ? 'encontrada ID: ' . $person->id : 'não encontrada'));
            
            // Se não encontrar, tenta encontrar pelo id_user
            if (!$person) {
                $person = Person::where('id_user', $personId)->first();
                Log::info('Busca por id_user: ' . ($person ? 'encontrada ID: ' . $person->id : 'não encontrada'));
            } else {
                Log::info('Pessoa encontrada pelo ID direto: ' . $person->id);
            }
            
            if (!$person) {
                Log::warning('Pessoa não encontrada para PersonId: ' . $personId);
                return response()->json([
                    'message' => 'Pessoa não encontrada'
                ], 404);
            }

            Log::info('Procurando candidatura ID: ' . $candidacyId . ' para pessoa ID: ' . $person->id);
            
            // Debug: listar todas as candidaturas da pessoa
            $allCandidacies = $person->candidacy()->get();
            Log::info('Todas as candidaturas da pessoa: ' . json_encode($allCandidacies->pluck('id')->toArray()));
            
            $candidacy = $person->candidacy()->find($candidacyId);
            Log::info('Candidatura encontrada: ' . ($candidacy ? 'ID: ' . $candidacy->id . ', Status: ' . $candidacy->status : 'não encontrada'));
            
            if (!$candidacy) {
                Log::warning('Candidatura não encontrada - ID: ' . $candidacyId . ' para pessoa: ' . $person->id);
                return response()->json([
                    'message' => 'Candidatura não encontrada ou já foi cancelada anteriormente'
                ], 404);
            }

            // Verifica se a candidatura já está cancelada
            if ($candidacy->status === 'Cancelado') {
                Log::warning('Candidatura já cancelada: ' . $candidacy->id);
                return response()->json([
                    'message' => 'Esta candidatura já foi cancelada anteriormente'
                ], 409);
            }

            // Verificar se há entrevista relacionada e removê-la primeiro
            $interview = $candidacy->interview;
            if ($interview) {
                Log::info('Removendo entrevista relacionada: ' . $interview->id);
                $interview->delete();
            }

            // Deleta a candidatura
            Log::info('Deletando candidatura: ' . $candidacy->id);
            $candidacy->delete();
            Log::info('Candidatura cancelada com sucesso');

            return response()->json([
                'message' => 'Candidatura cancelada com sucesso'
            ], 200);

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
