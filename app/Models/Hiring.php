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

    public function vacancy()
    {
        return $this->belongsTo(Vacancy::class, 'id_vacancy');
    }

    public function person()
    {
        return $this->belongsTo(Person::class, 'id_person');
    }

    public function candidacy()
    {
        return $this->belongsTo(Candidacy::class, 'id_candidacy');
    }

    public function classification()
    {
        return $this->belongsTo(Classification::class, 'id_classification');
    }
}