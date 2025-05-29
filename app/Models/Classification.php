<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Classification extends Model
{
    protected $table = 'classification';

    protected $fillable = [
        'id_admin',
        'id_candidacy',
        'id_vacancy',
        'nota_coeficiente_rendimento',
        'nota_entrevista',
        'nota_historico',
        'situacao',
        'motivo_situacao'
    ];

    public function candidacy()
    {
        return $this->belongsTo(Candidacy::class, 'id_candidacy');
    }

    public function vacancy()
    {
        return $this->belongsTo(Process::class, 'id_vacancy');
    }
}