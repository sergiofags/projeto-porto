<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('process/inicio-processo');
    })->name('inicio-processo');

    Route::get('/processo/cadastrar-vaga', function () {
        return Inertia::render('vacancy/cadastrar-vaga');
    })->middleware(['auth', 'verified']);

    Route::get('/processo/vagas', function () {
        return Inertia::render('vacancy/visualizar-vagas');
    })->middleware(['auth', 'verified']);

    Route::get('/processo/vagas/editar', function () {
        return Inertia::render('vacancy/acoes/editar');
    })->middleware(['auth', 'verified']);

    Route::get('/processo/vagas/detalhes', function () {
        return Inertia::render('vacancy/acoes/detalhes-da-vaga');
    })->middleware(['auth', 'verified']);
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
