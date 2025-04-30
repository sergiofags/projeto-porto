<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Process extends Model
{
    protected $table = 'process';

    protected $fillable = [
        'descricao',
        'status',
        'data_inicio',
        'data_fim',
        'numero_processo',
        'edital',
    ];

    public function vacancies()
    {
        return $this->hasMany(Vacancy::class, 'id_process');
    }

    public function candidacies()
    {
        return $this->hasMany(Candidacy::class, 'id_process');
    }

    public function classifications()
    {
        return $this->hasMany(Classification::class, 'id_process');
    }
}