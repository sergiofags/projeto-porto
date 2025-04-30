<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Complementary_Experience extends Model
{
    protected $table = 'complementary_experience';

    protected $fillable = [
        'id_pessoa',
        'tipo_experiencia',
        'titulo',
        'descricao',
        'nivel_idioma',
        'certificado',
        'data_inicio',
        'data_fim',
        'instituicao',
    ];

    public function person()
    {
        return $this->belongsTo(Person::class, 'id_person');
    }
}