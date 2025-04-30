<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProcessController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/process', [ProcessController::class, 'index'])->name('process.index');
Route::post('/process', [ProcessController::class, 'store'])->name('process.store');