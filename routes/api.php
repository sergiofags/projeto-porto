<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    ProcessController,
    PersonController,
    VacancyController,
    DocumentController,
    ExperienceController,
    ComplementaryExperienceController,
    CandidacyController,
    InterviewController,
    ClassificationController
};

Route::middleware('auth:sanctum')->get('/user', fn (Request $request) => $request->user());

// :/api/process
Route::prefix('process')->controller(ProcessController::class)->group(function () {
    Route::get('/', 'index')->name('process.index'); // Exibe TODOS os Processos
    Route::post('/admin/{adminId}', 'store')->name('process.store'); // Cadastra Processo
    Route::put('/admin/{adminId}/{processId}', 'update')->name('process.update'); // Atualiza Processo
    Route::get('/{processId}', 'show')->name('process.show'); // Exite Processo Especifico

    // :/api/process/{processId}/vacancy
    Route::prefix('{processId}/vacancy')->controller(VacancyController::class)->group(function () {
        Route::get('/', 'index')->name('vacancy.index'); // Exibe TODAS as Vagas de um Processo
        Route::post('/admin/{adminId}', 'store')->name('vacancy.store'); // Cadastra Vaga
        Route::get('/{vacancyId}', 'show')->name('vacancy.show'); // Exibe Vaga Especifica
        Route::put('/admin/{adminId}/{vacancyId}', 'update')->name('vacancy.update'); // Atualiza Vaga
        Route::delete('/admin/{adminId}/{vacancyId}', 'delete')->name('vacancy.delete'); // Deleta Vaga
    });
});

// :/api/person
Route::prefix('person')->group(function () {
    Route::controller(PersonController::class)->group(function () {
        Route::get('/', 'index')->name('person.index'); // Exibe TODAS as Pessoas
        Route::post('/', 'store')->name('person.store'); // Cadastra Pessoa
        Route::get('/{personId}', 'show')->name('person.show'); // Exibe Pessoa Especifica
        Route::put('/{personId}', 'update')->name('person.update'); // Atualiza Pessoa
    });

    // :/api/person/{personId}/document
    Route::prefix('{personId}/document')->controller(DocumentController::class)->group(function () {
        Route::get('/', 'index')->name('document.index'); // Exibe TODOS os Documentos de uma Pessoa Especifica
        Route::post('/', 'store')->name('document.store'); // Cadastra Documento
        Route::get('/{documentId}', 'show')->name('document.show'); // Exibe Documento Especifico
        Route::put('/{documentId}', 'update')->name('document.update'); // Atualiza Documento
    });

    // :/api/person/{personId}/experience
    Route::prefix('{personId}/experience')->controller(ExperienceController::class)->group(function () {
        Route::get('/', 'index')->name('experience.index'); // Exibe TODAS as Experiencias de uma Pessoa Especifica
        Route::post('/', 'store')->name('experience.store'); // Cadastra Experiencia
        Route::get('/{experienceId}', 'show')->name('experience.show'); // Exibe Experiencia Especifica
        Route::put('/{experienceId}', 'update')->name('experience.update'); // Atualiza Experiencia
        Route::delete('/{experienceId}', 'delete')->name('experience.delete'); // Deleta Experiencia
    });

    // :/api/person/{personId}/complementaryexperience
    Route::prefix('{personId}/complementaryexperience')->controller(ComplementaryExperienceController::class)->group(function () {
        Route::get('/', 'index')->name('complementary.index'); // Exibe TODAS as Experencias Complementares de uma Pessoa Especifica
        Route::post('/', 'store')->name('complementary.store'); // Cadastra Experencia Complementar
        Route::get('/{id}', 'show')->name('complementary.show'); // Exibe Experencia Complementar Especifica
        Route::put('/{id}', 'update')->name('complementary.update'); // Atualiza Experencia Complementar
        Route::delete('/{id}', 'delete')->name('complementary.delete'); // Deleta Experencia Complementar
    });

    // :/api/person/{personId}/candidacy
    Route::prefix('{personId}/candidacy')->controller(CandidacyController::class)->group(function () {
        Route::get('/', 'allCandidacyByPerson')->name('candidacy.byPerson'); // Exibe Candidatura por Pessoa
        Route::get('/{candidacyId}', 'specificCandidacyByPerson')->name('candidacy.byPerson.specific'); // Exibe Candidatura por Pessoa Especifica
        Route::put('/{candidacyId}', 'update')->name('candidacy.update'); // Atualiza Candidatura
    });

    // :/api/person/{personId}/vacancy/{vacancyId}/candidacy
    Route::post('{personId}/vacancy/{vacancyId}/candidacy', [CandidacyController::class, 'store'])->name('candidacy.store'); // Cadastra Candidatura
});

// :/api/vacancy/{vacancyId}/candidacy
Route::prefix('vacancy/{vacancyId}/candidacy')->controller(CandidacyController::class)->group(function () {
    Route::get('/', 'allCandidacyByVacancy')->name('candidacy.byVacancy'); // Exibe TODAS as Candidatura Por Vaga
    Route::get('/{candidacyId}', 'specificCandidacyByVacancy')->name('candidacy.byVacancy.specific'); // Exibe uma Candidatura Especifica
});

// :/api/candidacy/{candidacyId}/interview
Route::prefix('candidacy/{candidacyId}/interview')->controller(InterviewController::class)->group(function () {
    Route::get('/', 'index')->name('interview.index'); // Exibe Entrevistas
    Route::post('/admin/{adminId}', 'store')->name('interview.store'); // Cadastra Entrevista
    Route::put('/admin/{adminId}/{interviewId}', 'update')->name('interview.update'); // Atualiza Entrevista
});

// :/api/vacancy/{vacancyId}/classification
Route::get('/vacancy/{vacancyId}/classification', [ClassificationController::class, 'index'])->name('classification.index'); // Exibe Classificação por Vaga

// :/api/candidacy/{candidacyId}/classification
Route::prefix('candidacy/{candidacyId}/classification')->controller(ClassificationController::class)->group(function () {
    Route::post('/admin/{adminId}', 'store')->name('classification.store'); // Cria Classificação (Dar notas ao candidato)
    Route::put('/admin/{adminId}/{classificationId}/note', 'update')->name('classification.updateNote'); // Atualiza Classificação (Atualizar notas do candidato)
});

// :/api/vacancy/{vacancyId}/candidacy/{candidacyId}/note
Route::get('/vacancy/{vacancyId}/candidacy/{candidacyId}/note', [ClassificationController::class, 'showByCandidacy'])->name('classification.showByCandidacy'); // Exibe Notas de uma Candidatura Especifica 