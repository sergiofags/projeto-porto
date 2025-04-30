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

    public function person()
    {
        return $this->belongsTo(Person::class, 'id_person');
    }

    public function vacancy()
    {
        return $this->belongsTo(Vacancy::class, 'id_vacancy');
    }

    public function process()
    {
        return $this->belongsTo(Process::class, 'id_process');
    }

    public function interview()
    {
        return $this->hasOne(Interview::class, 'id_candidacy');
    }

    public function classification()
    {
        return $this->hasOne(Classification::class, 'id_candidacy');
    }

    public function hiring()
    {
        return $this->hasOne(Hiring::class, 'id_candidacy');
    }
}