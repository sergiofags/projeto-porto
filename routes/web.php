<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Http\Middleware\AdminMiddleware;
use Http\Middleware\CandidateMiddleware;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/processos', function () {
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

    Route::get('/processo/vagas/ver-candidatos', function () {
        return Inertia::render('candidacy/ver-candidatos');
    })->middleware(['auth', 'verified']);



    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/process/edita-processo', function () {
            return Inertia::render('process/edita-processo');
        })->name('edita-processo');
    });
});

Route::get('/cadastra-processo', function () {
    return Inertia::render('process/cadastra-processo');
})->middleware(['auth', 'verified']);

Route::get('/process/inicio-vaga', function () {
    return Inertia::render('process/inicio-vaga');
})->name('inicio-vaga');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('inicio-vaga', function () {
        return Inertia::render('vacancy/inicio-vaga');
    })->name('inicio-vaga');
});

Route::get('/', function () {
    if (!Auth::check()) {
        return Inertia::render('landing-page');
    }

    $user = Auth::user();

    if ($user && $user->tipo_perfil === 'Candidato') {
        return Inertia::render('landing-page');
    }

    // Se está logado e NÃO é candidato, redireciona para outra página
    return redirect()->route('inicio-processo');
})->name('landing-page');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
