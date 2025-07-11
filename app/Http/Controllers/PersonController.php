<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Person;
use Illuminate\Support\Facades\Storage;

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
                    'id' => optional($person)->id, // Adicionar o ID do Person
                    'foto_perfil' => optional($person)->foto_perfil,
                    'sobre' => optional($person)->sobre,
                    'linkedin' => optional($person)->linkedin,
                    'instagram' => optional($person)->instagram,
                    'facebook' => optional($person)->facebook,
                    'twitter' => optional($person)->twitter,
                    'cpf' => optional($person)->cpf,
                    'data_nascimento' => optional($person)->data_nascimento 
                    ? \Carbon\Carbon::parse($person->data_nascimento)->format('d/m/Y') 
                    : null,
                    'genero' => optional($person)->genero,
                    'deficiencia' => optional($person)->deficiencia,
                    'qual_deficiencia' => optional($person)->qual_deficiencia,
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

    public function show(Request $request, $personId)
    {
        try {
            // Primeiro, tenta encontrar a pessoa pelo ID direto
            $person = Person::find($personId);
            
            // Se não encontrar, tenta encontrar pelo id_user
            if (!$person) {
                $person = Person::where('id_user', $personId)->first();
            }
            
            // Se ainda não encontrou, tenta encontrar o usuário pelo ID
            if (!$person) {
                $user = User::find($personId);
                if (!$user) {
                    return response()->json([
                        'message' => 'Usuário não encontrado.'
                    ], 404);
                }
                $person = Person::where('id_user', $user->id)->first();
            }

            // Buscar dados do usuário
            $user = $person ? User::find($person->id_user) : User::find($personId);
            if (!$user) {
                return response()->json([
                    'message' => 'Usuário não encontrado.'
                ], 404);
            }

            $result = [
                'id_user' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'person_exists' => $person !== null, // Indicador se o registro Person existe
                'foto_perfil' => optional($person)->foto_perfil,
                'sobre' => optional($person)->sobre,
                'linkedin' => optional($person)->linkedin,
                'instagram' => optional($person)->instagram,
                'facebook' => optional($person)->facebook,
                'twitter' => optional($person)->twitter,
                'cpf' => optional($person)->cpf,
                'data_nascimento' => optional($person)->data_nascimento,
                'genero' => optional($person)->genero,
                'deficiencia' => optional($person)->deficiencia,
                'qual_deficiencia' => optional($person)->qual_deficiencia,
                'servico_militar' => optional($person)->servico_militar,
                'telefone' => optional($person)->telefone,
                'rua' => optional($person)->rua,
                'bairro' => optional($person)->bairro,
                'cidade' => optional($person)->cidade,
                'estado' => optional($person)->estado,
                'numero' => optional($person)->numero,
                'complemento' => optional($person)->complemento,
                'cep' => optional($person)->cep,
                'referencia' => optional($person)->referencia,
            ];

            return response()->json($result, 200, [], JSON_PRETTY_PRINT);

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

    public function store(Request $request)
    {
        try {
            if ($request->has('data_nascimento')) {
                $dataNascimento = \DateTime::createFromFormat('d/m/Y', $request->input('data_nascimento'));
                if ($dataNascimento) {
                    $request->merge(['data_nascimento' => $dataNascimento->format('Y-m-d')]);
                } else {
                    return response()->json([
                        'message' => 'Formato de data_nascimento inválido. Use dd/mm/yyyy.'
                    ], 422);
                }
            }

            $validatedData = $request->validate([
                'id_user' => 'required|integer|unique:person,id_user',
                'foto_perfil' => 'nullable|string|max:255',
                'sobre' => 'nullable|string|max:255',
                'linkedin' => 'nullable|string|max:255',
                'instagram' => 'nullable|string|max:255',
                'facebook' => 'nullable|string|max:255',
                'twitter' => 'nullable|string|max:255',
                'cpf' => 'nullable|string|max:14|unique:person,cpf',
                'data_nascimento' => 'nullable|date',
                'genero' => 'nullable|in:Masculino,Feminino,Outro',
                'deficiencia' => 'nullable|in:true,false',
                'qual_deficiencia' => 'nullable|string|max:255',
                'servico_militar' => 'nullable|in:true,false',
                'telefone' => 'nullable|string|max:20',
                'rua' => 'nullable|string|max:255',
                'bairro' => 'nullable|string|max:255',
                'cidade' => 'nullable|string|max:255',
                'estado' => 'nullable|string|max:255',
                'numero' => 'nullable|string|max:10',
                'complemento' => 'nullable|string|max:255',
                'cep' => 'nullable|string|max:10',
                'referencia' => 'nullable|string|max:255',
                'estou_ciente' => 'nullable|in:true,false',
            ]);

            // Só valida CPF se foi fornecido
            if (!empty($validatedData['cpf'])) {
                $cpf = $validatedData['cpf'];
                if (!$this->validCPF($cpf)) {
                    return response()->json([
                        'message' => 'CPF inválido.'
                    ], 422);
                }
            }

            // Remover a linha que define o id manualmente
            $person = Person::create($validatedData);

            // Cria a pasta do candidato
            $userId = $person->id_user ?? $person->id;
            $folderCandidatura = "Candidato{$userId}/Documentos_Candidato";
            $folderContratacao = "Candidato{$userId}/Documentos_Contratacao";
            Storage::disk('public')->makeDirectory($folderCandidatura);
            Storage::disk('public')->makeDirectory($folderContratacao);

            return response()->json($person, 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação.',
                'error' => $e->errors()
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

    public function update(Request $request, $personId)
    {
        try {
            if ($request->has('data_nascimento')) {
                $dataNascimento = \DateTime::createFromFormat('d/m/Y', $request->input('data_nascimento'));
                if ($dataNascimento) {
                    $request->merge(['data_nascimento' => $dataNascimento->format('Y-m-d')]);
                } else {
                    return response()->json([
                        'message' => 'Formato de data_nascimento inválido. Use dd/mm/yyyy.'
                    ], 422);
                }
            }

            $validatedData = $request->validate([
                'foto_perfil' => 'nullable|string|max:255',
                'sobre' => 'nullable|string|max:255',
                'linkedin' => 'nullable|string|max:255',
                'instagram' => 'nullable|string|max:255',
                'facebook' => 'nullable|string|max:255',
                'twitter' => 'nullable|string|max:255',
                'cpf' => 'nullable|string|max:14',
                'data_nascimento' => 'nullable|date',
                'genero' => 'nullable|in:Masculino,Feminino,Outro',
                'deficiencia' => 'nullable|in:true,false',
                'qual_deficiencia' => 'nullable|string|max:255',
                'servico_militar' => 'nullable|in:true,false',
                'telefone' => 'nullable|string|max:20',
                'rua' => 'nullable|string|max:255',
                'bairro' => 'nullable|string|max:255',
                'cidade' => 'nullable|string|max:255',
                'estado' => 'nullable|string|max:255',
                'numero' => 'nullable|string|max:10',
                'complemento' => 'nullable|string|max:255',
                'cep' => 'nullable|string|max:10',
                'referencia' => 'nullable|string|max:255',
                'estou_ciente' => 'nullable|in:true,false',
            ]);

            $person = Person::find($personId);
            if (!$person) {
                return response()->json([
                    'message' => 'Pessoa não encontrada.'
                ], 404);
            }

            if ($person->cpf !== $validatedData['cpf']) {
                $cpfExists = Person::where('cpf', $validatedData['cpf'])
                    ->where('id', '!=', $person->id)
                    ->exists();
                if ($cpfExists) {
                    return response()->json([
                        'message' => 'CPF já está em uso por outra pessoa.'
                    ], 422);
                }
            }

            $person->update($validatedData);

            return response()->json($person, 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação.',
                'error' => $e->errors()
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
    
    public function validatedCpf(Request $request, $cpf)
    {
        return response()->json([
            'valid' => $this->validCPF($cpf)
        ]);
    }

    private function validCPF($cpf)
    {
        $cpf = preg_replace('/[^0-9]/is', '', $cpf);

        if (strlen($cpf) != 11) {
            return false;
        }

        if (preg_match('/(\d)\1{10}/', $cpf)) {
            return false;
        }

        for ($t = 9; $t < 11; $t++) {
            for ($d = 0, $c = 0; $c < $t; $c++) {
                $d += $cpf[$c] * (($t + 1) - $c);
            }
            $d = ((10 * $d) % 11) % 10;
            if ($cpf[$c] != $d) {
                return false;
            }
        }

        return true;
    }
}