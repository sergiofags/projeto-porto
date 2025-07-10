<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $table = 'course';

    protected $fillable = [
        'nome',
        'setor_id'
    ];

    public function setor()
    {
        return $this->belongsTo(Setor::class, 'setor_id');
    }
}
