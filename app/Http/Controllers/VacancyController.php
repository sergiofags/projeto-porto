<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Vacancy;
use App\Models\Process;
Use App\Models\User;
use Dotenv\Exception\ValidationException;
use Exception;

class VacancyController extends Controller
{
    public function index(Request $request, $processId)
    {
        try {
            $process = Process::find($processId);
            if (!$process) {
                return response()->json([
                    'message' => 'Processo não encontrado.'
                ], 404);
            }

            $vacancy = $process->vacancy;
            return response()->json($vacancy);

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

    public function show(Request $request, $processId, $vacancyId)
    {
        try {
            $process = Process::find($processId);
            if (!$process) {
                return response()->json([
                    'message' => 'Processo não encontrado.'
                ], 404);
            }

            $vacancy = $process->vacancy()->find($vacancyId);
            if (!$vacancy) {
                return response()->json([
                    'message' => 'Vaga não encontrada.'
                ], 404);
            }

            return response()->json($vacancy);

        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'Erro ao acessar o banco de dados.',
                'error' => $e->getMessage()
            ], 500);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erro interno no servidor.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request, $adminId, $processId, $setorId)
    {
        try {
            $admin = User::where('id', $adminId)->where('tipo_perfil', 'Admin')->first();
            if (!$admin) {
                return response()->json([
                    'message' => 'Administrador não encontrado ou não possui perfil de Admin.'
                ], 404);
            }

            $process = Process::find($processId);
            if (!$process) {
                return response()->json([
                    'message' => 'Processo não encontrado.'
                ], 404);
            }
            
            $validatedData = $request->validate([
                'titulo' => 'required|string|max:255',
                'responsabilidades' => 'nullable|string',
                'requisitos' => 'nullable|string',
                'carga_horaria' => 'nullable|string|max:255',
                'remuneracao' => 'nullable|numeric|min:0',
                'beneficios' => 'nullable|string',
                'quantidade' => 'nullable|integer|min:1',
                'data_inicio' => 'nullable|date|before_or_equal:data_fim',
                'data_fim' => 'nullable|date|after_or_equal:data_inicio',
                'status' => 'required|in:Aberto,Fechado',
            ]);

            if (isset($validatedData['data_fim']) && $validatedData['data_inicio'] > $validatedData['data_fim']) {
                return response()->json([
                    'message' => 'A data de início não pode ser maior que a data de fim.',
                ], 422);
            }

            if ($process->data_fim < now()) {
                return response()->json(['message' => 'O processo já foi encerrado.'], 409);
            }

            $validatedData['id_process'] = $process->id;
            $validatedData['id_admin'] = $adminId;
            $validatedData['setor_id'] = $setorId;

            $vacancy = Vacancy::create($validatedData);

            return response()->json($vacancy, 201);

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

    public function update(Request $request, $adminId, $processId, $vacancyId, $setorId)
    {
        try {
            $admin = User::where('id', $adminId)->where('tipo_perfil', 'Admin')->first();
            if (!$admin) {
                return response()->json([
                    'message' => 'Administrador não encontrado ou não possui perfil de Admin.'
                ], 404);
            }

            $process = Process::find($processId);
            if (!$process) {
                return response()->json([
                    'message' => 'Processo não encontrado.'
                ], 404);
            }

            $vacancy = $process->vacancy()->find($vacancyId);
            if (!$vacancy) {
                return response()->json([
                    'message' => 'Vaga não encontrada.'
                ], 404);
            }

            $validatedData = $request->validate([
                'titulo' => 'required|string|max:255',
                'responsabilidades' => 'nullable|string',
                'requisitos' => 'nullable|string',
                'carga_horaria' => 'nullable|string|max:255',
                'remuneracao' => 'nullable|numeric|min:0',
                'beneficios' => 'nullable|string',
                'quantidade' => 'nullable|integer|min:1',
                'data_inicio' => 'nullable|date|before_or_equal:data_fim',
                'data_fim' => 'nullable|date|after_or_equal:data_inicio',
                'status' => 'required|in:Aberto,Fechado',
            ]);

            if (isset($validatedData['data_fim']) && $validatedData['data_inicio'] > $validatedData['data_fim']) {
                return response()->json([
                    'message' => 'A data de início não pode ser maior que a data de fim.',
                ], 422);
            }

            $validatedData['id_admin'] = $adminId;
            $validatedData['setor_id'] = $setorId;

            $vacancy->update($validatedData);

            return response()->json($vacancy);

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

    public function delete(Request $request, $adminId, $processId, $vacancyId)
    {
        try {
            $admin = User::where('id', $adminId)->where('tipo_perfil', 'Admin')->first();
            if (!$admin) {
                return response()->json([
                    'message' => 'Administrador não encontrado ou não possui perfil de Admin.'
                ], 404);
            }

            $process = Process::find($processId);
            if (!$process) {
                return response()->json([
                    'message' => 'Processo não encontrado.'
                ], 404);
            }

            $vacancy = $process->vacancy()->find($vacancyId);
            if (!$vacancy) {
                return response()->json([
                    'message' => 'Vaga não encontrada.'
                ], 404);
            }

            $vacancy->delete();

            return response()->json([
                'message' => 'Vaga excluída com sucesso.'
            ], 204);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro interno no servidor.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
