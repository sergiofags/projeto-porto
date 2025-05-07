<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Candidacy;
use App\Models\Classification;
use App\Models\Vacancy;
use App\Models\Process;

class ClassificationController extends Controller
{
    public function index($vacancyId)
    {
        $vacancy = Vacancy::findOrFail($vacancyId);
        $classification = $vacancy->classification;

        foreach ($classification as $item) {
            $item->nota_final = $item->nota_entrevista + $item->nota_historico;
        }

        $classification = $classification->sortByDesc('nota_final')->values();

        return response()->json($classification);
    }

    public function store(Request $request, $candidacyId)
    {
        $candidacy = Candidacy::findOrFail($candidacyId);

        $validatedData = $request->validate([
            'nota_coeficiente_rendimento' => 'nullable|numeric|min:0|max:10',
            'nota_entrevista' => 'nullable|numeric|min:0|max:10',
            'situacao' => 'nullable|in:Habilitado,Inabilitado,Desclassificado',
            'motivo_situacao' => 'nullable|in:Esperar RH',
        ]);

        $validatedData['id_candidacy'] = $candidacy->id;
        $validatedData['id_vacancy'] = $candidacy->id_vacancy;

        $validatedData['situacao'] = $validatedData['situacao'] ?? 'Habilitado';
        $validatedData['motivo_situacao'] = $validatedData['motivo_situacao'] ?? 'Esperar RH';

        $coeficienteRendimento = $validatedData['nota_coeficiente_rendimento'] ?? null;

        if ($coeficienteRendimento <= 5) {
            $notaHistorico = 5;
        }
        if ($coeficienteRendimento > 5 && $coeficienteRendimento <= 7) {
            $notaHistorico = 15;
        }
        if ($coeficienteRendimento > 7 && $coeficienteRendimento <= 8) {
            $notaHistorico = 25;
        }
        if ($coeficienteRendimento > 8 && $coeficienteRendimento <= 9) {
            $notaHistorico = 35;
        }
        if ($coeficienteRendimento > 9 && $coeficienteRendimento <= 10) {
            $notaHistorico = 50;
        }

        $validatedData['nota_historico'] = $notaHistorico;
        $classification = Classification::create($validatedData);

        return response()->json($classification, 201);
    }

    public function update(Request $request, $candidacyId, $classificationId)
    {
        $candidacy = Candidacy::findOrFail($candidacyId);
        $classification = Classification::findOrFail($classificationId);

        $validatedData = $request->validate([
            'nota_coeficiente_rendimento' => 'nullable|numeric|min:0|max:10',
            'nota_entrevista' => 'nullable|numeric|min:0|max:10',
            'situacao' => 'nullable|in:Habilitado,Inabilitado, Desclassificado',
            'motivo_situacao' => 'nullable|string|max:255',
        ]);

        $coeficienteRendimento = $validatedData['nota_coeficiente_rendimento'] ?? null;

        if ($coeficienteRendimento <= 5) {
            $notaHistorico = 5;
        }
        if ($coeficienteRendimento > 5 && $coeficienteRendimento <= 7) {
            $notaHistorico = 15;
        }
        if ($coeficienteRendimento > 7 && $coeficienteRendimento <= 8) {
            $notaHistorico = 25;
        }
        if ($coeficienteRendimento > 8 && $coeficienteRendimento <= 9) {
            $notaHistorico = 35;
        }
        if ($coeficienteRendimento > 9 && $coeficienteRendimento <= 10) {
            $notaHistorico = 50;
        }

        $validatedData['nota_historico'] = $notaHistorico;

        $classification->update($validatedData);

        return response()->json($classification);
    }
}
