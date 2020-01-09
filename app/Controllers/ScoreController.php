<?php

namespace memory\Controllers;

use memory\Models\ScoreModel;

class ScoreController extends CoreController
{
    /**
     * Fonction responsable de l'affichage de la page d'accueil (+ récupération des meilleurs scores)
     */
    public function index()
    {
        // Récupération des scores à afficher sur la page d'accueil en faisant appel à la méthode static findTenBestScore() définie dans le ScoreModel
        $scores = ScoreModel::findTenBestScore();
        
        // Permet de stocker les variables qui seront disponibles ensuite dans la view
        $this->assign('scores', $scores);

        // Affichage de la view
        $this->show('game');
    }

    /**
     * Fonction responsable de l'insertion en bdd d'un nouveau score
     */
    public function save()
    {
        // Récupération des données envoyées en POST
        // trim permet de supprimer les espaces en début et en fin de chaîne https://www.php.net/manual/fr/function.trim.php
        // htmlspecialchars convertit les caractères spéciaux en entités HTML https://www.php.net/manual/fr/function.htmlspecialchars.php
        // Même si un contrôle des données est déjà fait par le front, il est INDISPENSABLE de recontrôler les données en back car on ne fait jamais confiance aux données envoyées par le front (possibilité de hacking)
        // On vérifie que chaque variable est bien remplie (sinon on s'en charge) pour éviter les erreurs lors de l'insertion en bdd - si la bdd impose qu'un champ ne soit pas null et que la variable est null alors cela renverra une erreur, on s'affranchit de ça ici
        $name = isset($_POST['pseudo']) ? trim(htmlspecialchars($_POST['pseudo'])) : '';
        $duration = isset($_POST['duration']) ? $_POST['duration'] : 0;
        $count_founded_pair = isset($_POST['count_founded_pair']) ? $_POST['count_founded_pair'] : 0;
        $count_error = isset($_POST['count_error']) ? $_POST['count_error'] : 0;

        // Création d'un nouvel objet score basé sur le modèle de score
        // puis ajout de l'ensemble des données
        $score = new ScoreModel();
        $score->setName($name);
        $score->setDuration($duration);
        $score->setCountFoundedPair($count_founded_pair);
        $score->setCountError($count_error);
        // Insertion en bdd en faisant appel à la méthode insert du modèle
        $score->insert();

        // Création du tableau de réponse à envoyer au front
        $response = [
            'success' => true,
        ];

        // Précision au navigateur que la réponse est en JSON
        header('Content-Type: application/json');
        // Affichage de la version encodée en JSON du tableau associatif
        // http://php.net/json_encode
        // JSON_PRETTY_PRINT => pour formater le code afin qu'un humain le comprenne
        echo json_encode($response, JSON_PRETTY_PRINT);
    }
}
