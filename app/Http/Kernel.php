<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $routeMiddleware = [
        // Other middleware
        'admin' => \App\Http\Middleware\AdminMiddleware::class,
        'candidate' => \App\Http\Middleware\CandidateMiddleware::class,
    ];
}