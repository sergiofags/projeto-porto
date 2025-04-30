<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProcessController;
use App\Http\Controllers\PersonController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/process', [ProcessController::class, 'index'])->name('process.index');
Route::post('/process', [ProcessController::class, 'store'])->name('process.store');
Route::put('/process/{id}', [ProcessController::class, 'update'])->name('process.update');
Route::get('/process/{id}', [ProcessController::class, 'show'])->name('process.show');

Route::get('/person', [PersonController::class, 'index'])->name('person.index');
Route::post('/person', [PersonController::class, 'store'])->name('person.store');
Route::get('/person/{id}', [PersonController::class, 'show'])->name('person.show');