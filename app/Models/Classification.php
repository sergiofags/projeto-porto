<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Classification extends Model
{
    protected $table = 'classification';

    protected $fillable = [
        'id_candidatura',
        'nota_coeficiente_rendimento',
        'nota_entrevista',
        'situacao',
        'motivo_situacao'
    ];

    public function candidacy()
    {
        return $this->belongsTo(Candidacy::class, 'id_candidacy');
    }

    public function process()
    {
        return $this->belongsTo(Process::class, 'id_process');
    }
}