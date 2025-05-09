<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Person;

use Illuminate\Validation\ValidationException;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PersonController extends Controller
{
    public function index()
    {
        try {
            $users = User::all();
            $people = Person::all();
            $array = [];

            foreach ($users as $user) {
                $person = $people->firstWhere('id_user', $user->id);

                $data = [
                    'id_user' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ];

                $personData = [
                    'foto_perfil' => optional($person)->foto_perfil,
                    'sobre' => optional($person)->sobre,
                    'linkedin' => optional($person)->linkedin,
                    'cpf' => optional($person)->cpf,
                    'data_nascimento' => optional($person)->data_nascimento,
                    'genero' => optional($person)->genero,
                    'deficiencia' => optional($person)->deficiencia,
                    'servico_militar' => optional($person)->servico_militar,
                    'telefone' => optional($person)->telefone,
                    'rua' => optional($person)->rua,
                    'bairro' => optional($person)->bairro,
                    'cidade' => optional($person)->cidade,
                    'estado' => optional($person)->estado,
                    'numero' => optional($person)->numero,
                    'complemento' => optional($person)->complemento,
                    'cep' => optional($person)->cep,
                    'referencia' => optional($person)->referencia
                ];

                $array[] = array_merge($data, $personData);
            }

            return response()->json($array, 200, [], JSON_PRETTY_PRINT);

        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'Erro ao acessar o banco de dados',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro interno no servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request, $personId)
    {
        try {
            $user = User::findOrFail($personId);
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

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Usuário ou pessoa não encontrada.',
                'error' => $e->getMessage()
            ], 404);

        } catch (Exception $e) {
            Log::error('Erro ao buscar pessoa: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erro interno no servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'id_user' => 'required|integer|unique:person,id_user',
                'foto_perfil' => 'nullable|string|max:255',
                'sobre' => 'nullable|string|max:255',
                'linkedin' => 'nullable|string|max:255',
                'cpf' => 'required|string|max:14|unique:person,cpf',
                'data_nascimento' => 'required|date',
                'genero' => 'required|in:Masculino,Feminino,Outro',
                'deficiencia' => 'nullable|boolean',
                'servico_militar' => 'nullable|boolean',
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

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $e->errors()
            ], 422);

        } catch (Exception $e) {
            Log::error('Erro ao criar pessoa: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erro interno no servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $personId)
    {
        try {
            $validatedData = $request->validate([
                'foto_perfil' => 'nullable|string|max:255',
                'sobre' => 'nullable|string|max:255',
                'linkedin' => 'nullable|string|max:255',
                'cpf' => 'required|string|max:14|unique:person,cpf',
                'data_nascimento' => 'required|date',
                'genero' => 'required|in:Masculino,Feminino,Outro',
                'deficiencia' => 'nullable|boolean',
                'servico_militar' => 'nullable|boolean',
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

            $person = Person::findOrFail($personId);

            $person->update($validatedData);

            return response()->json($person, 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $e->errors()
            ], 422);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Pessoa não encontrada.',
                'error' => $e->getMessage()
            ], 404);

        } catch (Exception $e) {
            Log::error('Erro ao atualizar pessoa: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erro interno no servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
