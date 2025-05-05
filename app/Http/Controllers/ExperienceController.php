<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Person;
use App\Models\Experience;

class ExperienceController extends Controller
{
    public function index(Request $request, $personId)
    {
        $person = Person::findOrFail($personId);
        $experience = $person->experience;
        return response()->json($experience);
    }

    public function show(Request $request, $personId, $experienceId)
    {
        $person = Person::findOrFail($personId);
        $experience = $person->experience()->findOrFail($experienceId);
        return response()->json($experience);
    }

    public function store(Request $request, $personId)
    {
        $person = Person::findOrFail($personId);

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
    }

    public function update(Request $request, $personId, $experienceId)
    {
        $person = Person::findOrFail($personId);
        $experience = $person->experience()->findOrFail($experienceId);

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
    }
}