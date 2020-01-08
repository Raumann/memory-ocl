<?php

use memory\Application as App;

/*
Utilisation de l'autoloader selon la convention psr-4 (définition dans le fichier composer.json)
L'autoloader permet de charger l'ensemble des classes (eviter les include et require) en se basant sur l'utilisation des namespaces
https://www.php-fig.org/psr/psr-4/
*/
require __DIR__ . '/../vendor/autoload.php';

// Instanciation de mon application (= frontcontroller)
$application = new App();

// Démarrage de mon application
$application->run();