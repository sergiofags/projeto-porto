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
use App\Http\Controllers\ClassificationController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\SetorController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/process', [ProcessController::class, 'index'])->name('process.index'); //Retorna todos os processos
Route::post('/admin/{adminId}/process', [ProcessController::class, 'store'])->name('process.store'); //Cria um novo processo
Route::put('/admin/{adminId}/process/{processId}', [ProcessController::class, 'update'])->name('process.update'); //Atualiza um processo
Route::get('/process/{processId}', [ProcessController::class, 'show'])->name('process.show'); //Retorna um processo específico

Route::get('/process/{processId}/vacancy', [VacancyController::class, 'index'])->name('vacancy.index'); //Retorna todas as vagas de um processo
Route::post('/admin/{adminId}/process/{processId}/vacancy/setor/{setorId}', [VacancyController::class, 'store'])->name('vacancy.store'); //Cria uma nova vaga
Route::get('/process/{processId}/vacancy/{vacancyId}', [VacancyController::class, 'show'])->name('vacancy.show'); //Retorna uma vaga específica
Route::put('/admin/{adminId}/process/{processId}/vacancy/{vacancyId}', [VacancyController::class, 'update'])->name('vacancy.update');//Atualiza uma vaga
Route::delete('/admin/{adminId}/process/{processId}/vacancy/{vacancyId}/delete', [VacancyController::class, 'delete'])->name('vacancy.delete');//Deleta uma vaga

Route::get('/person', [PersonController::class, 'index'])->name('person.index'); //Retorna todas as pessoas (somente para fins de teste, não será utilizado no projeto final)
Route::post('/person', [PersonController::class, 'store'])->name('person.store'); //Cria uma nova pessoa
Route::put('/person/{personId}', [PersonController::class, 'update'])->name('person.update'); //Atualiza uma pessoa
Route::get('/person/{personId}', [PersonController::class, 'show'])->name('person.show'); //Retorna uma pessoa específica (deverá ser utilizado para mostrar o perfil do candidato)

Route::get('/person/{personId}/document', [DocumentController::class, 'index'])->name('document.index'); //Retorna todos os documentos de uma pessoa
Route::post('/person/{personId}/document', [DocumentController::class, 'store'])->name('document.store');; //Cria um novo documento
Route::get('/person/{personId}/document/{documentId}', [DocumentController::class, 'show'])->name('document.show'); //Retorna um documento específico
Route::put('/person/{personId}/document/{documentId}', [DocumentController::class, 'update'])->name('document.update');; //Atualiza um documento
Route::post('/person/{personId}/document/{documentId}', [DocumentController::class, 'update'])->name('document.update.post'); //Atualiza um documento via POST com _method

Route::get('/person/{personId}/experience', [ExperienceController::class, 'index'])->name('experience.index'); //Retorna todas as experiências de uma pessoa
Route::post('/person/{personId}/experience', [ExperienceController::class, 'store'])->name('experience.store'); //Cria uma nova experiência 
Route::get('/person/{personId}/experience/{experienceId}', [ExperienceController::class, 'show'])->name('experience.show'); //Retorna uma experiência específica
Route::put('/person/{personId}/experience/{experienceId}', [ExperienceController::class, 'update'])->name('experience.update'); //Atualiza uma experiência 
Route::delete('/person/{personId}/experience/{experienceId}', [ExperienceController::class, 'delete'])->name('experience.delete'); //Deleta uma experiência específica

Route::get('/person/{personId}/complementaryexperience', [ComplementaryExperienceController::class, 'index'])->name('complementaryexperience.index'); //Retorna todas as experiências complementares de uma pessoa
Route::post('/person/{personId}/complementaryexperience', [ComplementaryExperienceController::class, 'store'])->name('complementaryexperience.store'); //Cria uma nova experiência complementar 
Route::get('/person/{personId}/complementaryexperience/{complementaryExperienceId}', [ComplementaryExperienceController::class, 'show'])->name('complementaryexperience.show'); //Retorna uma experiência complementar específica
Route::put('/person/{personId}/complementaryexperience/{complementaryExperienceId}', [ComplementaryExperienceController::class, 'update'])->name('complementaryexperience.update'); //Atualiza uma experiência complementar 
Route::delete('/person/{personId}/complementaryexperience/{complementaryExperienceId}', [ComplementaryExperienceController::class, 'delete'])->name('complementaryexperience.delete'); //Deleta uma experiência específica

Route::get('/person/{personId}/candidacy', [CandidacyController::class, 'allCandidacyByPerson'])->name('candidacy.allCandidacyByPerson'); //Retorna toodas as candidaturas por pessoa
Route::get('/person/{personId}/candidacy/{candidacyId}', [CandidacyController::class, 'specificCandidacyByPerson'])->name('candidacy.specificCandidacyByPerson'); //Retorna uma candidatura especifica de uma pessoa
Route::get('/vacancy/{vacancyId}/candidacy', [CandidacyController::class, 'allCandidacyByVacancy'])->name('candidacy.allCandidacyByVacancy'); //Retorna todas as candidaturas por vaga
Route::get('/vacancy/{vacancyId}/candidacy/{candidacyId}', [CandidacyController::class, 'specificCandidacyByVacancy'])->name('candidacy.specificCandidacyByVacancy'); //Retorna uma candidatura especifica de uma vaga
Route::post('/person/{personId}/vacancy/{vacancyId}/candidacy', [CandidacyController::class, 'store'])->name('candidacy.store'); //Cria uma nova candidatura
Route::put('/person/{personId}/candidacy/{candidacyId}', [CandidacyController::class, 'update'])->name('candidacy.update'); //Atualiza uma candidatura
Route::delete('/person/{personId}/candidacy/{candidacyId}', [CandidacyController::class, 'cancel'])->name('candidacy.cancel'); //Cancela uma candidatura

Route::get('/candidacy/{candidacyId}/interview', [InterviewController::class, 'index'])->name('interview.index'); //Retorna a entrevista relacionada a candidatura
Route::post('/admin/{adminId}/candidacy/{candidacyId}/interview', [InterviewController::class, 'store'])->name('interview.store'); //Cria uma nova entrevista
Route::put('/admin/{adminId}/candidacy/{candidacyId}/interview/{interviewId}', [InterviewController::class, 'update'])->name('interview.update'); //Atualiza uma entrevista

Route::get('/vacancy/{vacancyId}/classification', [ClassificationController::class, 'index'])->name('classification.index'); //Retorna todas as classificações de uma vaga
Route::post('/admin/{adminId}/candidacy/{candidacyId}/classification', [ClassificationController::class, 'store'])->name('classification.store'); //Cria uma nova classificação para uma candidatura
Route::get('/vacancy/{vacancyId}/candidacy/{candidacyId}/note', [ClassificationController::class, 'showByCandidacy'])->name('classification.showByCandidacy'); //Retorna a nota/classificação de uma candidatura específica em uma vaga
Route::put('/admin/{adminId}/candidacy/{candidacyId}/classification/{classificationId}/note', [ClassificationController::class, 'update'])->name('classification.update'); //Atualiza uma classificação para uma candidatura
Route::get('/process/{processId}/classification', [ClassificationController::class, 'indexByProcess'])->name('classification.indexByProcess'); //Retorna todas as classificações por processo

Route::get('/courses', [CourseController::class, 'index'])->name('course.index');
Route::get('/courses/{courseId}', [CourseController::class, 'show'])->name('course.show');
Route::get('/courses/setor/{setorId}', [CourseController::class, 'showBySetor'])->name('course.showBySetor');
Route::post('/courses/setor/{setorId}', [CourseController::class, 'store'])->name('course.store');
Route::put('/courses/{courseId}/update', [CourseController::class, 'update'])->name('course.update');
Route::delete('/courses/{courseId}', [CourseController::class, 'delete'])->name('course.delete');

Route::get('/setores', [SetorController::class, 'index'])->name('course.index');
Route::get('/setores/{setorId}', [SetorController::class, 'show'])->name('course.show');
Route::post('/setores', [SetorController::class, 'store'])->name('course.store');
Route::put('/setores/{setorId}', [SetorController::class, 'update'])->name('course.update');
Route::delete('/setores/{setorId}', [SetorController::class, 'delete'])->name('course.delete');