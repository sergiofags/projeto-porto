<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProcessController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\VacancyController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\ComplementaryExperienceController;
use App\Http\Controllers\CandidacyController;
use App\Http\Controllers\InterviewController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/process', [ProcessController::class, 'index'])->name('process.index');
Route::post('/process', [ProcessController::class, 'store'])->name('process.store');
Route::put('/process/{processId}', [ProcessController::class, 'update'])->name('process.update');
Route::get('/process/{processId}', [ProcessController::class, 'show'])->name('process.show');

Route::get('/process/{processId}/vacancy', [VacancyController::class, 'index'])->name('vacancy.index');
Route::post('/process/{processId}/vacancy', [VacancyController::class, 'store'])->name('vacancy.store');
Route::get('/process/{processId}/vacancy/{vacancyId}', [VacancyController::class, 'show'])->name('vacancy.show');
Route::put('/process/{processId}/vacancy/{vacancyId}', [VacancyController::class, 'update'])->name('vacancy.update');

Route::get('/person', [PersonController::class, 'index'])->name('person.index');
Route::post('/person', [PersonController::class, 'store'])->name('person.store');
Route::put('/person/{personId}', [PersonController::class, 'update'])->name('person.update');
Route::get('/person/{personId}', [PersonController::class, 'show'])->name('person.show');

Route::get('/person/{personId}/document', [DocumentController::class, 'index'])->name('document.index');
Route::post('/person/{personId}/document', [DocumentController::class, 'store'])->name('document.store');
Route::get('/person/{personId}/document/{documentId}', [DocumentController::class, 'show'])->name('document.show');
Route::put('/person/{personId}/document/{documentId}', [DocumentController::class, 'update'])->name('document.update');

Route::get('/person/{personId}/experience', [ExperienceController::class, 'index'])->name('experience.index');
Route::post('/person/{personId}/experience', [ExperienceController::class, 'store'])->name('experience.store');
Route::get('/person/{personId}/experience/{experienceId}', [ExperienceController::class, 'show'])->name('experience.show');
Route::put('/person/{personId}/experience/{experienceId}', [ExperienceController::class, 'update'])->name('experience.update');

Route::get('/person/{personId}/complementaryexperience', [ComplementaryExperienceController::class, 'index'])->name('complementaryexperience.index');
Route::post('/person/{personId}/complementaryexperience', [ComplementaryExperienceController::class, 'store'])->name('complementaryexperience.store');
Route::get('/person/{personId}/complementaryexperience/{complementaryExperienceId}', [ComplementaryExperienceController::class, 'show'])->name('complementaryexperience.show');
Route::put('/person/{personId}/complementaryexperience/{complementaryExperienceId}', [ComplementaryExperienceController::class, 'update'])->name('complementaryexperience.update');

Route::get('/person/{personId}/candidacy', [CandidacyController::class, 'allCandidacyByPerson'])->name('candidacy.allCandidacyByPerson');
Route::get('/person/{personId}/candidacy/{candidacyId}', [CandidacyController::class, 'specificCandidacyByPerson'])->name('candidacy.specificCandidacyByPerson');
Route::get('/vacancy/{vacancyId}/candidacy', [CandidacyController::class, 'allCandidacyByVacancy'])->name('candidacy.allCandidacyByVacancy');
Route::get('/vacancy/{vacancyId}/candidacy/{candidacyId}', [CandidacyController::class, 'specificCandidacyByVacancy'])->name('candidacy.specificCandidacyByVacancy');
Route::post('/person/{personId}/vacancy/{vacancyId}/candidacy', [CandidacyController::class, 'store'])->name('candidacy.store');
Route::put('/person/{personId}/candidacy/{candidacyId}', [CandidacyController::class, 'update'])->name('candidacy.update');

Route::get('/candidacy/{candidacyId}/interview', [InterviewController::class, 'index'])->name('interview.index');
Route::post('/candidacy/{candidacyId}/interview', [InterviewController::class, 'store'])->name('interview.store');
Route::put('/candidacy/{candidacyId}/interview/{interviewId}', [InterviewController::class, 'update'])->name('interview.update');