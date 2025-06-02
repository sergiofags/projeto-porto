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

            $experience = $person->experience->map(function ($exp) {
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
                'tipo_experiencia' => 'required|in:Acadêmica,Profissional',
                'status' => 'nullable|in:Trancado,Cursando,Formado',
                'empresa_instituicao' => 'required|string|max:255',
                'curso_cargo' => 'required|string|max:255',
                'nivel' => 'nullable|in:Graduacao,PosGraduacao',
                'atividades' => 'nullable|string|max:1000',
                'semestre_modulo' => 'nullable|string|max:255',
                'data_inicio' => 'required|date',
                'data_fim' => 'nullable|date',
                'emprego_atual' => 'required|in:Sim,Não',
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
                'nivel' => 'nullable|string|max:255',
                'atividades' => 'nullable|string|max:1000',
                'semestre_modulo' => 'nullable|string|max:255',
                'data_inicio' => 'required|date',
                'data_fim' => 'nullable|date',
                'emprego_atual' => 'required|in:Sim,Não',
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

    public function delete(Request $request, $personId, $experienceId)
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

            $experience->delete();

            return response()->json($experience, 200);

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