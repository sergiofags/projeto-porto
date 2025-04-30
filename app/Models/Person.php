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

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function experiences()
    {
        return $this->hasMany(Experience::class, 'id_person');
    }

    public function complementaryExperiences()
    {
        return $this->hasMany(Complementary_Experience::class, 'id_person');
    }

    public function candidacies()
    {
        return $this->hasMany(Candidacy::class, 'id_person');
    }

    public function documents()
    {
        return $this->hasMany(Document::class, 'id_person');
    }

    public function hirings()
    {
        return $this->hasMany(Hiring::class, 'id_person');
    }
}