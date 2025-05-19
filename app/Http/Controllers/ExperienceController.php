<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Person;
use App\Models\Experience;

class ExperienceController extends Controller
{
    public function index(Request $request, $personId)
    {
        try {
            $person = Person::find($personId);
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada.'
                ], 404);
            }

            $experience = $person->experience;
            return response()->json($experience);

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

    public function show(Request $request, $personId, $experienceId)
    {
        try {
            $person = Person::find($personId);
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada.'
                ], 404);
            }

            $experience = $person->experience()->find($experienceId);
            if (!$experience) {
                return response()->json([
                    'message' => 'Experiência não encontrada.'
                ], 404);
            }

            return response()->json($experience);

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
            $person = Person::find($personId);
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada.'
                ], 404);
            }

            $validatedData = $request->validate([
                'tipo_experiencia' => 'required|in:Acadêmica,Profissional',
                'status' => 'required|in:Trancado,Cursando,Formado,EmpregoAnterior,EmpregoAtual',
                'empresa_instituicao' => 'required|string|max:255',
                'curso_cargo' => 'required|string|max:255',
                'nivel' => 'required|string|max:255',
                'atividades' => 'nullable|string|max:1000',
                'semestre_modulo' => 'nullable|string|max:255',
                'data_inicio' => 'required|date',
                'data_fim' => 'nullable|date',
            ]);

            $validatedData['id_person'] = $person->id;

            $experience = Experience::create($validatedData);

            return response()->json($experience, 201);

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

    public function update(Request $request, $personId, $experienceId)
    {
        try {
            $person = Person::find($personId);
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada.'
                ], 404);
            }

            $experience = $person->experience()->find($experienceId);
            if (!$experience) {
                return response()->json([
                    'message' => 'Experiência não encontrada.'
                ], 404);
            }

            $validatedData = $request->validate([
                'tipo_experiencia' => 'required|in:Acadêmica,Profissional',
                'status' => 'required|in:Trancado,Cursando,Formado,EmpregoAnterior,EmpregoAtual',
                'empresa_instituicao' => 'required|string|max:255',
                'curso_cargo' => 'required|string|max:255',
                'nivel' => 'required|string|max:255',
                'atividades' => 'nullable|string|max:1000',
                'semestre_modulo' => 'nullable|string|max:255',
                'data_inicio' => 'required|date',
                'data_fim' => 'nullable|date',
            ]);

            $experience->update($validatedData);

            return response()->json($experience, 200);

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

    public function allExperienceByType(Request $request, $personId, $typeExperience)
    {
        try {
            $person = Person::find($personId);
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada.'
                ], 404);
            }

            $experiences = $person->experience()->where('tipo_experiencia', $typeExperience)->get();
            return response()->json($experiences);

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