<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Process extends Model
{
    protected $table = 'process';

    protected $fillable = [
        'id_vaga',
        'id_candidatura',
        'status',
        'data_inicio',
        'data_fim',
        'numero_processo',
        'edital',
    ];

    public function vacancy(): BelongsTo
    {
        return $this->belongsTo(Vacancy::class, 'id_vaga');
    }

    public function candidacy(): BelongsTo
    {
        return $this->belongsTo(Candidacy::class, 'id_candidatura');
    }
}