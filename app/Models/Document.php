<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    protected $table = 'document';

    protected $fillable = [
        'id_pessoa',
        'tipo_documento',
        'documento',
        'nome_documento',
    ];

    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class, 'id_pessoa');
    }
}