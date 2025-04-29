<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Candidacy extends Model
{
    protected $table = 'candidacy';

    protected $fillable = [
        'id_pessoa',
        'id_vaga',
        'status',
        'data_candidatura',
    ];

    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'id_pessoa');
    }

    public function vacancy(): BelongsTo
    {
        return $this->belongsTo(Vacancy::class, 'id_vaga');
    }
}