<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\User;
use Dotenv\Exception\ValidationException;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        try {
            $courses = Course::all();
            if (!$courses) {
                return response()->json([
                    'message' => 'Curso não encontrado.'
                ], 404);
            }
            return response()->json($courses);

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

    public function showBySetor(Request $request, $setorId)
    {
        try {
            $courses = Course::where('setor_id', $setorId)->get();

            if ($courses->isEmpty()) {
                return response()->json([
                    'message' => 'Nenhum curso encontrado para o setor informado.'
                ], 404);
            }

            return response()->json($courses);

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


    public function show(Request $request, $courseId)
    {
        try {
            $course = Course::find($courseId);
            if (!$course) {
                return response()->json([
                    'message' => 'Curso não encontrado.'
                ], 404);
            }
            return response()->json($course);

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

    public function store(Request $request, $setorId)
    {
        try {
            $validatedData = $request->validate([
                'nome' => 'nullable|string|max:255',
            ]);

            $validatedData['setor_id'] = $setorId;

            $course = Course::create($validatedData);

            return response()->json($course, 201);

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

    public function update(Request $request, $courseId)
    {
        try {
            $course = Course::find($courseId);

            if (!$course) {
                return response()->json([
                    'message' => 'Curso não encontrado.'
                ], 404);
            }

            $validatedData = $request->validate([
                'nome' => 'nullable|string|max:255',
            ]);

            $course->update($validatedData);

            return response()->json($course, 200);

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

    public function delete(Request $request, $courseId)
    {
        try {
            $course = Course::find($courseId);

            if (!$course) {
                return response()->json([
                    'message' => 'Curso não encontrado.'
                ], 404);
            }

            $course->delete();

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
