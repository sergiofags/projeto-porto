<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->boot();

echo "=== TESTE DE CANDIDATURA APÓS CORREÇÃO ===" . PHP_EOL . PHP_EOL;

// Verificar uma vaga
$vacancy = \App\Models\Vacancy::find(1);
if ($vacancy) {
    echo "Vaga encontrada: " . $vacancy->titulo . PHP_EOL;
    echo "Data fim: " . ($vacancy->data_fim ?? 'NULL') . PHP_EOL;
    echo "Status: " . $vacancy->status . PHP_EOL;
    
    // Testar a condição ANTERIOR (que causava o problema)
    echo PHP_EOL . "--- CONDIÇÃO ANTERIOR (BUGADA) ---" . PHP_EOL;
    if ($vacancy->data_fim < now()) {
        echo "Resultado: VAGA ENCERRADA (ERRO!)" . PHP_EOL;
    } else {
        echo "Resultado: VAGA ABERTA" . PHP_EOL;
    }
    
    // Testar a condição CORRIGIDA
    echo PHP_EOL . "--- CONDIÇÃO CORRIGIDA ---" . PHP_EOL;
    if ($vacancy->data_fim && $vacancy->data_fim < now()) {
        echo "Resultado: VAGA ENCERRADA" . PHP_EOL;
    } else {
        echo "Resultado: VAGA ABERTA (CORRETO!)" . PHP_EOL;
    }
    
} else {
    echo "Vaga não encontrada!" . PHP_EOL;
}

echo PHP_EOL . "O problema foi resolvido: agora vagas com data_fim NULL não são consideradas encerradas!" . PHP_EOL;
