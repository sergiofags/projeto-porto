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

    public function experience()
    {
        return $this->hasMany(Experience::class, 'id_person');
    }

    public function complementaryExperience()
    {
        return $this->hasMany(ComplementaryExperience::class, 'id_person');
    }

    public function candidacy()
    {
        return $this->hasMany(Candidacy::class, 'id_person');
    }

    public function document()
    {
        return $this->hasMany(Document::class, 'id_person');
    }

    public function hiring()
    {
        return $this->hasMany(Hiring::class, 'id_person');
    }
}