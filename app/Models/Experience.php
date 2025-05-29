<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Experience extends Model
{
    protected $table = 'experience';

    protected $fillable = [
        'id_person',
        'tipo_experiencia',
        'status',
        'empresa_instituicao',
        'curso_cargo',
        'nivel',
        'atividades',
        'semestre_modulo',
        'data_inicio',
        'data_fim',
        'emprego_atual',
    ];

    public function person()
    {
        return $this->belongsTo(Person::class, 'id_person');
    }
    
}