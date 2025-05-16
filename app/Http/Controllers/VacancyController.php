<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Vacancy;
use App\Models\Process;

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

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erro interno no servidor.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request, $processId)
    {
        try {
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
                'carga_horaria' => 'required|string|max:255',
                'remuneracao' => 'required|numeric|min:0',
                'beneficios' => 'nullable|string',
                'quantidade' => 'required|integer|min:1',
                'data_inicio' => 'required|date|before_or_equal:data_fim',
                'data_fim' => 'nullable|date|after_or_equal:data_inicio',
                'tipo_vaga' => 'required|in:Graduacao,Pos-Graduacao',
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

            $vacancy = Vacancy::create($validatedData);

            return response()->json($vacancy, 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação.',
                'errors' => $e->validator->errors(),
            ], 422);
            
        } catch (Exception $e) {
            return response()->json(['message' => 'Erro interno do servidor.'], 500);
        }
    }

    public function update(Request $request, $processId, $vacancyId)
    {
        try {
            $process = Process::findOrFail($processId);
            if (!$process) {
                return response()->json([
                    'message' => 'Processo não encontrado.'
                ], 404);
            }

            $vacancy = $process->vacancy()->findOrFail($vacancyId);
            if (!$vacancy) {
                return response()->json([
                    'message' => 'Vaga não encontrada.'
                ], 404);
            }

            $validatedData = $request->validate([
                'titulo' => 'required|string|max:255',
                'responsabilidades' => 'nullable|string',
                'requisitos' => 'nullable|string',
                'carga_horaria' => 'required|string|max:255',
                'remuneracao' => 'required|numeric|min:0',
                'beneficios' => 'nullable|string',
                'quantidade' => 'required|integer|min:1',
                'data_inicio' => 'required|date|before_or_equal:data_fim',
                'data_fim' => 'nullable|date|after_or_equal:data_inicio',
                'tipo_vaga' => 'required|in:Graduacao,Pos-Graduacao',
            ]);

            if (isset($validatedData['data_fim']) && $validatedData['data_inicio'] > $validatedData['data_fim']) {
                return response()->json([
                    'message' => 'A data de início não pode ser maior que a data de fim.',
                ], 422);
            }

            $vacancy->update($validatedData);

            return response()->json($vacancy);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação.',
                'errors' => $e->errors()
            ], 422);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erro interno no servidor.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
