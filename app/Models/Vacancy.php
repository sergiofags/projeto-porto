<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vacancy extends Model
{
    protected $table = 'vacancy';

    protected $fillable = [
        'id_admin',
        'id_process',
        'setor_id',
        'titulo',
        'responsabilidades',
        'requisitos',
        'carga_horaria',
        'remuneracao',
        'beneficios',
        'quantidade',
        'data_inicio',
        'data_fim',
        'status',
    ];

    public function process()
    {
        return $this->belongsTo(Process::class, 'id_process');
    }

    public function candidacy()
    {
        return $this->hasMany(Candidacy::class, 'id_vacancy');
    }

    public function hiring()
    {
        return $this->hasMany(Hiring::class, 'id_vacancy');
    }

    public function classification()
    {
        return $this->hasMany(Classification::class, 'id_vacancy');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_admin');
    }

    public function setor()
    {
        return $this->belongsTo(Setor::class, 'setor_id');
    }
}