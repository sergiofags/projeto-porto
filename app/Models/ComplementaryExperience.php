<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComplementaryExperience extends Model
{
    protected $table = 'complementary_experience';

    protected $fillable = [
        'id_person',
        'tipo_experiencia',
        'titulo',
        'descricao',
        'nivel_idioma',
        'certificado',
        'data_inicio',
        'data_fim',
        'instituicao',
        'status'
    ];

    public function person()
    {
        return $this->belongsTo(Person::class, 'id_person');
    }
}