<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Process;
use Dotenv\Exception\ValidationException;

class ProcessController extends Controller
{
    public function index()
    {
        try {
            $process = Process::all();
            if (!$process) {
                return response()->json([
                    'message' => 'Processo não encontrado.'
                ], 404);
            }
            return response()->json($process);

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

    public function store(Request $request, $adminId)
    {
        try {
            $admin = User::where('id', $adminId)->where('tipo_perfil', 'Admin')->first();
            if (!$admin) {
                return response()->json([
                    'message' => 'Administrador não encontrado ou não possui perfil de Admin.'
                ], 404);
            }

            $validatedData = $request->validate([
                'descricao' => 'required|string|max:255',
                'status' => 'required|in:Pendente,Aberto,Fechado',
                'numero_processo' => 'required|string|max:255',
                'edital' => 'nullable|file|mimes:pdf|max:204800', // 200MB max
                'data_inicio' => 'required|date',
                'data_fim' => 'nullable|date',
            ]);
            // Verifica se o arquivo foi enviado e salva no storage
            if ($request->hasFile('edital')) {
                $file = $request->file('edital');
                $path = $file->store('editais', 'public'); // Salva em storage/app/public/editais
                $validatedData['edital'] = $path; // Salva o caminho correto no banco
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

            $validatedData['id_admin'] = $adminId;

            $process = Process::create($validatedData);

            return response()->json($process, 201);

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

    public function update(Request $request, $adminId, $processId)
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
                'descricao' => 'required|string|max:255',
                'status' => 'required|in:Pendente,Aberto,Fechado',
                'numero_processo' => 'required|string|max:255',
                'edital' => 'nullable|file|mimes:pdf|max:204800', // 200MB max
                'data_inicio' => 'required|date',
                'data_fim' => 'nullable|date',
            ]);

            // Verifica se o arquivo foi enviado e salva no storage
            if ($request->hasFile('edital')) {
                $file = $request->file('edital');
                $path = $file->store('editais', 'public'); // Salva em storage/app/public/editais
                $validatedData['edital'] = $path; // Salva o caminho correto no banco
            }

            if ($process->numero_processo !== $validatedData['numero_processo']) {
                $numeroProcessoExists = Process::where('numero_processo', $validatedData['numero_processo'])
                    ->where('id', '!=', $process->id)
                    ->exists();
                if ($numeroProcessoExists) {
                    return response()->json([
                        'message' => 'O número do processo já está em uso por outro processo.'
                    ], 422);
                }
            }

            if (isset($validatedData['data_fim']) && $validatedData['data_inicio'] > $validatedData['data_fim']) {
                return response()->json([
                    'message' => 'A data de início não pode ser maior que a data de fim.',
                ], 422);
            }

            $validatedData['id_admin'] = $adminId;

            $process->update($validatedData);

            return response()->json($process);

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
