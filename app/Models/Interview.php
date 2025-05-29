<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Interview extends Model
{
    protected $table = 'interview';

    protected $fillable = [
        'id_admin',
        'id_candidacy',
        'data_hora',
        'status',
        'localizacao',
    ]; 

    public function candidacy()
    {
        return $this->belongsTo(Candidacy::class, 'id_candidacy');
    }
}