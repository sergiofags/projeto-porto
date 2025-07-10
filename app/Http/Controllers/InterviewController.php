<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use App\Models\Candidacy;
use App\Models\Interview;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class InterviewController extends Controller
{
    public function index($candidacyId)
    {
        try {
            $candidacy = Candidacy::find($candidacyId);
            if (!$candidacy) {
                return response()->json([
                    'message' => 'Candidatura não encontrada.'
                ], 404);
            }

            $interview = $candidacy->interview;
            return response()->json($interview);

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

    public function store(Request $request, $adminId, $candidacyId)
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
                'data_hora' => 'required|date',
                'status' => 'required|in:Cancelada,Agendada,Finalizada',
                'localizacao' => 'required|string|max:255',
            ]);

            $validatedData['id_candidacy'] = $candidacy->id;
            $validatedData['id_admin'] = $adminId;

            $interview = Interview::create($validatedData);

            return response()->json($interview, 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação.',
                'error' => $e->errors()
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

    public function update(Request $request, $adminId, $candidacyId, $interviewId)
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

            $interview = Interview::find($interviewId);
            if (!$interview) {
                return response()->json([
                    'message' => 'Entrevista não encontrada.'
                ], 404);
            }

            $validatedData = $request->validate([
                'data_hora' => 'required|date',
                'status' => 'required|in:Cancelada,Agendada,Finalizada',
                'localizacao' => 'required|string|max:255',
            ]);

            $validatedData['id_admin'] = $adminId;

            $interview->update($validatedData);

            return response()->json($interview);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação.',
                'error' => $e->errors()
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
