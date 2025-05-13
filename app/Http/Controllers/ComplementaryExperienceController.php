<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Person;
use App\Models\ComplementaryExperience;

class ComplementaryExperienceController extends Controller
{
    public function index(Request $request, $personId)
    {
        $person = Person::findOrFail($personId);
        $complementaryExperience = $person->complementaryExperience;
        return response()->json($complementaryExperience);
    }

    public function show(Request $request, $personId, $complementaryExperienceId)
    {
        $person = Person::findOrFail($personId);
        $complementaryExperience = $person->complementaryExperience()->findOrFail($complementaryExperienceId);
        return response()->json($complementaryExperience);
    }

    public function store(Request $request, $personId)
    {
        $person = Person::findOrFail($personId);

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

        $validatedData['id_person'] = $person->id;

        $complementaryExperience = ComplementaryExperience::create($validatedData);

        return response()->json($complementaryExperience, 201);
    }

    public function update(Request $request, $personId, $complementaryExperienceId)
    {
        $person = Person::findOrFail($personId);
        $complementaryExperience = $person->complementaryExperience()->findOrFail($complementaryExperienceId);

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
    }

    public function allComplementaryExperienceByType(Request $request, $personId, $typeComplementaryExperience)
    {
        $person = Person::findOrFail($personId);

        $complementaryExperiences = $person->complementaryExperience()->where('tipo_experiencia', $typeComplementaryExperience)->get();
        return response()->json($complementaryExperiences);
    }
}
