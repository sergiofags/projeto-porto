<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Process;

class ProcessController extends Controller
{
    public function index()
    {
        try {
            $process = Process::all();
            return Inertia::render('process/inicio-processo', [
                response()->json($process),
                'user' => [
                    'name' => Auth::user()->name,
                ],
            ]);

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

    public function show(Request $request, $processId)
    {
        try {
            $process = Process::find($processId);

            if (!$process) {
                return response()->json([
                    'message' => 'Processo não encontrado.'
                ], 404);
            }

            return response()->json($process);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erro interno no servidor.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'descricao' => 'required|string|max:255',
                'status' => 'required|in:Pendente,Aberto,Fechado',
                'numero_processo' => 'required|string|max:255',
                'edital' => 'nullable|string|max:255',
                'data_inicio' => 'required|date',
                'data_fim' => 'nullable|date',
            ]);

            if (Process::where('numero_processo', $validatedData['numero_processo'])->exists()) {
                return response()->json([
                    'message' => 'O número do processo já existe.',
                ], 409);
            }

            if (isset($validatedData['data_fim']) && $validatedData['data_inicio'] > $validatedData['data_fim']) {
                return response()->json([
                    'message' => 'A data de início não pode ser maior que a data de fim.',
                ], 422);
            }

            $process = Process::create($validatedData);

            return response()->json($process, 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação.',
                'errors' => $e->validator->errors(),
            ], 422);

        } catch (Exception $e) {
            return response()->json(['message' => 'Erro interno do servidor.'], 500);
        }
    }

    public function update(Request $request, $processId)
    {
        try {
            $validatedData = $request->validate([
                'descricao' => 'required|string|max:255',
                'status' => 'required|in:Pendente,Aberto,Fechado',
                'numero_processo' => 'required|string|max:255',
                'edital' => 'nullable|string|max:255',
                'data_inicio' => 'required|date',
                'data_fim' => 'nullable|date',
            ]);

            $process = Process::find($processId);

            if (!$process) {
                return response()->json([
                    'message' => 'Processo não encontrado.'
                ], 404);
            }

            if (Process::where('numero_processo', $validatedData['numero_processo'])->exists()) {
                return response()->json([
                    'message' => 'O número do processo já existe.',
                ], 409);
            }

            if (isset($validatedData['data_fim']) && $validatedData['data_inicio'] > $validatedData['data_fim']) {
                return response()->json([
                    'message' => 'A data de início não pode ser maior que a data de fim.',
                ], 422);
            }

            $process->update($validatedData);

            return response()->json($process);

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