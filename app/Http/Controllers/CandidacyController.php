<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Candidacy;
use App\Models\Person;
use App\Models\Vacancy;
use App\Models\Process;

class CandidacyController extends Controller
{
    public function allCandidacyByPerson($personId)
    {
        $person = Person::findOrFail($personId);
        $candidacy = $person->candidacy;
        return response()->json($candidacy);
    }

    public function specificCandidacyByPerson($personId, $candidacyId)
    {
        $person = Person::findOrFail($personId);
        $candidacy = $person->candidacy()->findOrFail($candidacyId);
        return response()->json($candidacy);
    }

    public function allCandidacyByVacancy($vacancyId)
    {
        $vacancy = Vacancy::findOrFail($vacancyId);
        $candidacy = $vacancy->candidacy;
        return response()->json($candidacy);
    }

    public function specificCandidacyByVacancy($vacancyId, $candidacyId)
    {
        $vacancy = Vacancy::findOrFail($vacancyId);
        $candidacy = $vacancy->candidacy()->findOrFail($candidacyId);
        return response()->json($candidacy);
    }

    public function store(Request $request, $personId, $vacancyId)
    {
        $person = Person::findOrFail($personId);
        $vacancy = Vacancy::findOrFail($vacancyId);
        $process = Process::findOrFail($vacancy->id_process);

        $validatedData = $request->validate([
            'status' => 'required|in:Cancelado,Analise,Completo',
            'data_candidatura' => 'required|date',
        ]);

        $validatedData['id_person'] = $person->id;
        $validatedData['id_vacancy'] = $vacancy->id;
        $validatedData['id_process'] = $process->id;

        $candidacy = Candidacy::create($validatedData);

        return response()->json($candidacy, 201);
    }

    public function update(Request $request, $personId, $candidacyId)
    {
        $person = Person::findOrFail($personId);
        $candidacy = $person->candidacy()->findOrFail($candidacyId);

        $validatedData = $request->validate([
            'status' => 'required|in:Cancelado,Analise,Completo',
            'data_candidatura' => 'required|date',
        ]);

        $candidacy->update($validatedData);

        return response()->json($candidacy);
    }
}
