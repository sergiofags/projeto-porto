<?php

namespace App\Http\Controllers;

use App\Models\Setor;
use Dotenv\Exception\ValidationException;
use Illuminate\Http\Request;

class SetorController extends Controller
{
    public function index()
    {
        try {
            $setores = Setor::all();
            if (!$setores) {
                return response()->json([
                    'message' => 'Setor não encontrado.'
                ], 404);
            }
            return response()->json($setores);

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

    public function show(Request $request, $setorId)
    {
        try {
            $setor = Setor::find($setorId);
            if (!$setor) {
                return response()->json([
                    'message' => 'Setor não encontrado.'
                ], 404);
            }
            return response()->json($setor);

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

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'nome' => 'nullable|string|max:255',
            ]);

            $process = Setor::create($validatedData);

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

    public function update(Request $request, $setorId)
    {
        try {
            $setor = Setor::find($setorId);

            $validatedData = $request->validate([
                'nome' => 'sometimes|required|string|max:255',
            ]);

            $setor->update($validatedData);

            return response()->json($setor, 200);

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

    public function delete(Request $request, $setorId)
    {
        try {

            $setor = Setor::find($setorId);
            if (!$setor) {
                return response()->json([
                    'message' => 'Setor não encontrado.'
                ], 404);
            }

            $setor->delete();

            return response()->json([
                'message' => 'Curso excluído com sucesso.'
            ], 204);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro interno no servidor.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
