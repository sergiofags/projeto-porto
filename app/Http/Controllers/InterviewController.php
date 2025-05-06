<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Candidacy;
use App\Models\Interview;

class InterviewController extends Controller
{
    public function index($candidacyId)
    {
        $candidacy = Candidacy::findOrFail($candidacyId);
        $interview = $candidacy->interview;
        return response()->json($interview);
    }

    public function store(Request $request, $candidacyId)
    {
        $candidacy = Candidacy::findOrFail($candidacyId);

        $validatedData = $request->validate([
            'data_hora' => 'required|date',
            'status' => 'required|in:Cancelada,Agendada,Finalizada',
            'localizacao' => 'required|string|max:255',
        ]);

        $validatedData['id_candidacy'] = $candidacy->id;

        $interview = Interview::create($validatedData);

        return response()->json($interview, 201);
    }

    public function update(Request $request, $candidacyId, $interviewId)
    {
        $candidacy = Candidacy::findOrFail($candidacyId);
        $interview = Interview::findOrFail($interviewId);

        $validatedData = $request->validate([
            'data_hora' => 'required|date',
            'status' => 'required|in:Cancelada,Agendada,Finalizada',
            'localizacao' => 'required|string|max:255',
        ]);

        $interview->update($validatedData);

        return response()->json($interview);
    }
}
