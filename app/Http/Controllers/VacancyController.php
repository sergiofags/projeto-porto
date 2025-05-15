<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Vacancy;
use App\Models\Process;

class VacancyController extends Controller
{
    public function index(Request $request, $processId)
    {
        $process = Process::findOrFail($processId);
        $vacancy = $process->vacancy;
        return response()->json($vacancy);
    }

    public function show(Request $request, $processId, $vacancyId)
    {
        $process = Process::findOrFail($processId);
        $vacancy = $process->vacancy()->findOrFail($vacancyId);
        return response()->json($vacancy);
    }

    public function store(Request $request, $processId)
    {
        $process = Process::findOrFail($processId);

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

        if ($process->data_fim < now()) {
            return response()->json(['message' => 'O processo já foi encerrado'], 409);
        }

        $validatedData['id_process'] = $process->id;

        $vacancy = Vacancy::create($validatedData);

        return response()->json($vacancy, 201);
    }

    public function update(Request $request, $processId, $vacancyId)
    {
        $process = Process::findOrFail($processId);
        $vacancy = $process->vacancy()->findOrFail($vacancyId);

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

        $vacancy->update($validatedData);

        return response()->json($vacancy);
    }
}
