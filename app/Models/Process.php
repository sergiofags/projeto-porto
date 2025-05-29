<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Process extends Model
{
    protected $table = 'process';

    protected $fillable = [
        'id_admin',
        'descricao',
        'status',
        'data_inicio',
        'data_fim',
        'numero_processo',
        'edital',
    ];

    public function vacancy()
    {
        return $this->hasMany(Vacancy::class, 'id_process');
    }

    public function candidacy()
    {
        return $this->hasMany(Candidacy::class, 'id_process');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_admin');
    }
}