<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('process/inicio-processo');
    })->name('inicio-processo');
});

Route::get('/cadastra-processo', function () {
    return Inertia::render('process/cadastra-processo');
})->middleware(['auth', 'verified']);


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('inicio-vaga', function () {
        return Inertia::render('vacancy/inicio-vaga');
    })->name('inicio-vaga');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
