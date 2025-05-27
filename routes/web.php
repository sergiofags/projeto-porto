<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('process/inicio-processo');
    })->name('inicio-processo');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('inicio-processo', function () {
        return Inertia::render('process/inicio-processo');
    })->name('inicio-processo');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('cadastra-processo', function () {
        return Inertia::render('process/cadastra-processo');
    })->name('processo');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
