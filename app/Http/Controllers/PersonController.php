<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Person;

class PersonController extends Controller
{
    public function index()
    {
        $users = User::all();
        $people = Person::all();
        $array = [];

        foreach ($users as $user) {
            $person = $people->firstWhere('id_user', $user->id);

            if ($person) {
                $array[] = [
                    'id_user' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'foto_perfil' => $person->foto_perfil,
                    'sobre' => $person->sobre,
                    'linkedin' => $person->linkedin,
                    'cpf' => $person->cpf,
                    'data_nascimento' => $person->data_nascimento,
                    'genero' => $person->genero,
                    'deficiencia' => $person->deficiencia,
                    'servico_militar' => $person->servico_militar,
                    'telefone' => $person->telefone,
                    'rua' => $person->rua,
                    'bairro' => $person->bairro,
                    'cidade' => $person->cidade,
                    'estado' => $person->estado,
                    'numero' => $person->numero,
                    'complemento' => $person->complemento,
                    'cep' => $person->cep,
                    'referencia' => $person->referencia
                ];
            } else {
                $array[] = [
                    'id_user' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'foto_perfil' => null,
                    'sobre' => null,
                    'linkedin' => null,
                    'cpf' => null,
                    'data_nascimento' => null,
                    'genero' => null,
                    'deficiencia' => null,
                    'servico_militar' => null,
                    'telefone' => null,
                    'rua' => null,
                    'bairro' => null,
                    'cidade' => null,
                    'estado' => null,
                    'numero' => null,
                    'complemento' => null,
                    'cep' => null,
                    'referencia' => null
                ];
            }
        }

        return response()->json($array, 200, [], JSON_PRETTY_PRINT);
    }

    public function show(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $person = Person::where('id_user', $user->id)->first();

        $result = [
            'id_user' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'foto_perfil' => $person->foto_perfil ?? null,
            'sobre' => $person->sobre ?? null,
            'linkedin' => $person->linkedin ?? null,
            'cpf' => $person->cpf ?? null,
            'data_nascimento' => $person->data_nascimento ?? null,
            'genero' => $person->genero ?? null,
            'deficiencia' => $person->deficiencia ?? null,
            'servico_militar' => $person->servico_militar ?? null,
            'telefone' => $person->telefone ?? null,
            'rua' => $person->rua ?? null,
            'bairro' => $person->bairro ?? null,
            'cidade' => $person->cidade ?? null,
            'estado' => $person->estado ?? null,
            'numero' => $person->numero ?? null,
            'complemento' => $person->complemento ?? null,
            'cep' => $person->cep ?? null,
            'referencia' => $person->referencia ?? null,
        ];

        return response()->json($result, 200, [], JSON_PRETTY_PRINT);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'id_user' => 'required|integer',
            'foto_perfil' => 'nullable|string|max:255',
            'sobre' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'cpf' => 'required|string|max:14',
            'data_nascimento' => 'required|date',
            'genero' => 'required|in:Masculino,Feminino,Outro',
            'deficiencia' => 'nullable|boolean|max:255',
            'servico_militar' => 'nullable|boolean|max:255',
            'telefone' => 'nullable|string|max:20',
            'rua' => 'nullable|string|max:255',
            'bairro' => 'nullable|string|max:255',
            'cidade' => 'nullable|string|max:255',
            'estado' => 'nullable|string|max:255',
            'numero' => 'nullable|string|max:10',
            'complemento' => 'nullable|string|max:255',
            'cep' => 'nullable|string|max:10',
            'referencia' => 'nullable|string|max:255',
        ]);

        $person = Person::create($validatedData);

        return response()->json($person, 201);
    }
}