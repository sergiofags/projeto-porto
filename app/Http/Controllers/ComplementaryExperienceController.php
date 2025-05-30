<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Person;
use App\Models\ComplementaryExperience;

class ComplementaryExperienceController extends Controller
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

            $complementaryExperience = $person->complementaryExperience->map(function ($exp) {
                $dataInicio = \DateTime::createFromFormat('Y-m-d', $exp->data_inicio);
                $exp->data_inicio = $dataInicio ? $dataInicio->format('d/m/Y') : $exp->data_inicio;
            
                if ($exp->data_fim) {
                    $dataFim = \DateTime::createFromFormat('Y-m-d', $exp->data_fim);
                    $exp->data_fim = $dataFim ? $dataFim->format('d/m/Y') : $exp->data_fim;
                } else {
                    $exp->data_fim = null;
                }
            
                return $exp;
            });

            return response()->json($complementaryExperience);

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

    public function show(Request $request, $personId, $complementaryExperienceId)
    {
        try {
            $person = Person::find($personId);
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada.'
                ], 404);
            }

            $complementaryExperience = $person->complementaryExperience()->find($complementaryExperienceId);
            if (!$complementaryExperience) {
                return response()->json([
                    'message' => 'Experiência complementar não encontrada.'
                ], 404);
            }

            return response()->json($complementaryExperience);

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

            if ($request->has('data_inicio')) {
                $dataInicio = \DateTime::createFromFormat('d/m/Y', $request->input('data_inicio'));
                if ($dataInicio) {
                    $request->merge(['data_inicio' => $dataInicio->format('Y-m-d')]);
                } else {
                    return response()->json([
                        'message' => 'Formato de data_inicio inválido. Use dd/mm/yyyy.'
                    ], 422);
                }
            }

            if ($request->filled('data_fim')) {
                $dataFim = \DateTime::createFromFormat('d/m/Y', $request->input('data_fim'));
                if ($dataFim) {
                    $request->merge(['data_fim' => $dataFim->format('Y-m-d')]);
                } else {
                    return response()->json([
                        'message' => 'Formato de data_fim inválido. Use dd/mm/yyyy.'
                    ], 422);
                }
            } else {
                $request->merge(['data_fim' => null]);
            }

            $validatedData = $request->validate([
                'tipo_experiencia' => 'required|in:Idioma,Curso',
                'titulo' => 'required|string|max:255',
                'descricao' => 'nullable|string|max:1000',
                'nivel_idioma' => 'nullable|in:Básico,Intermediário,Avançado,Fluente/Nativo',
                'certificado' => 'nullable|string|max:255',
                'data_inicio' => 'required|date',
                'data_fim' => 'nullable|date',
                'instituicao' => 'required|string|max:255',
                'status' => 'required|in:Cursando,Concluido'
            ]);

            $validatedData['id_person'] = $person->id;

            if (isset($validatedData['data_fim'])) {
                $dataInicio = new \DateTime($validatedData['data_inicio']);
                $dataFim = new \DateTime($validatedData['data_fim']);
                if ($dataInicio > $dataFim) {
                    return response()->json([
                        'message' => 'A data de início não pode ser maior que a data de fim.',
                    ], 422);
                }
            }

            $complementaryExperience = ComplementaryExperience::create($validatedData);

            return response()->json($complementaryExperience, 201);

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

    public function update(Request $request, $personId, $complementaryExperienceId)
    {
        try {
            $person = Person::find($personId);
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada.'
                ], 404);
            }

            $complementaryExperience = $person->complementaryExperience()->find($complementaryExperienceId);
            if (!$complementaryExperience) {
                return response()->json([
                    'message' => 'Experiência complementar não encontrada.'
                ], 404);
            }

            $validatedData = $request->validate([
                'tipo_experiencia' => 'required|in:Idioma,Curso',
                'titulo' => 'required|string|max:255',
                'descricao' => 'nullable|string|max:1000',
                'nivel_idioma' => 'nullable|in:Básico,Intermediário,Avançado,Fluente/Nativo',
                'certificado' => 'nullable|string|max:255',
                'data_inicio' => 'required|date',
                'data_fim' => 'nullable|date',
                'instituicao' => 'required|string|max:255',
            ]);

            $complementaryExperience->update($validatedData);

            return response()->json($complementaryExperience, 200);

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

    public function delete(Request $request, $personId, $complementaryExperienceId)
    {
        try {
            $person = Person::find($personId);
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada.'
                ], 404);
            }
            
            $complementaryExperience = $person->complementaryExperience()->find($complementaryExperienceId);
            if (!$complementaryExperience) {
                return response()->json([
                    'message' => 'Experiência não encontrada.'
                ], 404);
            }

            $complementaryExperience->delete();

            return response()->json($complementaryExperience, 200);

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

    public function allComplementaryExperienceByType(Request $request, $personId, $typeComplementaryExperience)
    {
        try {
            $person = Person::find($personId);
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada.'
                ], 404);
            }

            $complementaryExperiences = $person->complementaryExperience()->where('tipo_experiencia', $typeComplementaryExperience)->get();
            return response()->json($complementaryExperiences);

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
