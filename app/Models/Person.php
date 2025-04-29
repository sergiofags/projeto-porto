<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Person extends Model
{
    protected $table = 'person';

    protected $fillable = [
        'id_user',
        'nome',
        'foto_perfil',
        'sobre',
        'linkedin',
        'cpf',
        'data_nascimento',
        'genero',
        'deficiencia',
        'servico_militar',
        'telefone',
        'rua',
        'bairro',
        'cidade',
        'estado',
        'numero',
        'complemento',
        'cep',
        'referencia'
    ];

    // BelongsTo = pertence a um registro de outra tabela
    // HasMany = tem muitos registros de outra tabela

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function candidacy(): HasMany
    {
        return $this->hasMany(Candidacy::class, 'id_pessoa');
    }

    public function experience(): HasMany
    {
        return $this->hasMany(Experience::class, 'id_pessoa');
    }

    public function complementary_experience(): HasMany
    {
        return $this->hasMany(Complementary_Experience::class, 'id_pessoa');
    }

    public function document(): HasMany
    {
        return $this->hasMany(Document::class, 'id_pessoa');
    }

    public function hiring(): HasMany
    {
        return $this->hasMany(Hiring::class, 'id_pessoa');
    }
}