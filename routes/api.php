<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProcessController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\VacancyController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/process', [ProcessController::class, 'index'])->name('process.index');
Route::post('/process', [ProcessController::class, 'store'])->name('process.store');
Route::put('/process/{processId}', [ProcessController::class, 'update'])->name('process.update');
Route::get('/process/{processId}', [ProcessController::class, 'show'])->name('process.show');

Route::get('/person', [PersonController::class, 'index'])->name('person.index');
Route::post('/person', [PersonController::class, 'store'])->name('person.store');
Route::put('/person/{personId}', [PersonController::class, 'update'])->name('person.update');
Route::get('/person/{personId}', [PersonController::class, 'show'])->name('person.show');

Route::get('/process/{processId}/vacancy', [VacancyController::class, 'index'])->name('vacancy.index');
Route::post('/process/{processId}/vacancy', [VacancyController::class, 'store'])->name('vacancy.store');
Route::get('/process/{processId}/vacancy/{vacancyId}', [VacancyController::class, 'show'])->name('vacancy.show');
Route::put('/process/{processId}/vacancy/{vacancyId}', [VacancyController::class, 'update'])->name('vacancy.update');