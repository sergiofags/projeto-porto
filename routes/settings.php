<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');

    Route::get('settings/experience', function () {
        return Inertia::render('settings/experience');
    })->name('experience');

    Route::get('settings/complementary-experience', function () {
        return Inertia::render('settings/complementary-experience');
    })->name('complementary-experience');
    
    Route::get('settings/documents', function () {
        return Inertia::render('settings/documents');
    })->name('documents');

    Route::get('settings/documents_hiring', function () {
        return Inertia::render('settings/documents_hiring');
    })->name('documents_hiring');

});
