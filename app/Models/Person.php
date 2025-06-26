<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Person extends Model
{
    protected $table = 'person';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'id',
        'id_user',
        'foto_perfil',
        'sobre',
        'linkedin',
        'instagram',
        'facebook',
        'twitter',
        'cpf',
        'data_nascimento',
        'genero',
        'deficiencia',
        'qual_deficiencia',
        'servico_militar',
        'telefone',
        'rua',
        'bairro',
        'cidade',
        'estado',
        'numero',
        'complemento',
        'cep',
        'referencia',
        'estou_ciente',
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