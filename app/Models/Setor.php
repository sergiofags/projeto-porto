<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setor extends Model
{
    protected $table = 'setores';

    protected $fillable = [
        'nome',
    ];

    public function courses()
    {
        return $this->hasMany(Course::class, 'setor_id');
    }

    public function vacancies()
    {
        return $this->hasMany(Vacancy::class, 'setor_id');
    }
}
