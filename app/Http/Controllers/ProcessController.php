<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Process;

class ProcessController extends Controller
{
    public function index()
    {
        $process = Process::all();
        return response()->json($process);
    }

    public function show(Request $request, $processId)
    {
        $process = Process::findOrFail($processId);
        return response()->json($process);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'descricao' => 'required|string|max:255',
            'status' => 'required|in:Pendente,Aberto,Fechado',
            'numero_processo' => 'required|string|max:255',
            'edital' => 'nullable|string|max:255',
            'data_inicio' => 'required|date',
            'data_fim' => 'nullable|date',
        ]);

        $process = Process::create($validatedData);

        return response()->json($process, 201);
    }

    public function update(Request $request, $processId)
    {
        $validatedData = $request->validate([
            'descricao' => 'required|string|max:255',
            'status' => 'required|in:Pendente,Aberto,Fechado',
            'numero_processo' => 'required|string|max:255',
            'edital' => 'nullable|string|max:255',
            'data_inicio' => 'required|date',
            'data_fim' => 'nullable|date',
        ]);

        $process = Process::findOrFail($processId);

        $process->update($validatedData);

        return response()->json($process);
    }
}
