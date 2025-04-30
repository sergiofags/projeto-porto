<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vacancy extends Model
{
    protected $table = 'vacancy';

    protected $fillable = [
        'titulo',
        'responsabilidades',
        'requisitos',
        'carga_horaria',
        'remuneracao',
        'beneficios',
        'quantidade',
        'data_inicio',
        'data_fim',
        'tipo_vaga',
    ];

    public function process()
    {
        return $this->belongsTo(Process::class, 'id_process');
    }

    public function candidacies()
    {
        return $this->hasMany(Candidacy::class, 'id_vacancy');
    }

    public function hirings()
    {
        return $this->hasMany(Hiring::class, 'id_vacancy');
    }
}