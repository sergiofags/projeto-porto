<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Hiring extends Model
{
    protected $table = 'hiring';

    protected $fillable = [
        'id_vaga',
        'id_pessoa',
        'id_candidatura',
        'id_classificacao',
        'data_contratacao',
        'data_exame',
        'professor_orientador',
        'registro_academico',
        'numero_contrato',
        'apolice_seguro',
    ];

    public function vacancy(): BelongsTo
    {
        return $this->belongsTo(Vacancy::class, 'id_vaga');
    }

    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'id_pessoa');
    }

    public function candidacy(): BelongsTo
    {
        return $this->belongsTo(Candidacy::class, 'id_candidatura');
    }

    public function classification(): BelongsTo
    {
        return $this->belongsTo(Classification::class, 'id_classificacao');
    }
}