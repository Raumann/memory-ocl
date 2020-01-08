<?php

namespace memory;

class Application
{
    private $router;

    /**
     * Constructeur créant le routing à l'aide du package altorouter
     * https://altorouter.com
     * https://github.com/dannyvankooten/AltoRouter
     */
    public function __construct()
    {
        // Utilisation de AltoRouter afin de gérer l'ensemble du routing du site
        $this->router = new \AltoRouter();

        // Récupération de la BASE URI mise en place via le .htaccess
        $baseUrl = isset($_SERVER['BASE_URI']) ? trim($_SERVER['BASE_URI']) : '/';

        // Définition de la BASE_URI à AltoRouter
        $this->router->setBasePath($baseUrl);

        // Appel de la méthode defineRoutes qui se charge de remplir l'objet AltoRouter avec nos routes
        $this->defineRoutes();
    }

    public function run()
    {
        // Match URL actuelle
        $match = $this->router->match();

        // $match peut valoir :
        //   - false si aucune route ne correspond à l'url actuelle
        //   - un tableau si une correspondance (= un "match") a été trouvée
        if ($match !== false) {

            list($controllerName, $methodName) = explode('#', $match['target']);

            $params = $match['params'];

        } else {

            $controllerName = 'ErrorController';
            $methodName = 'Error404';
            $params = array();
        }

        // Redéfinition du nom du controller avec le namespace afin d'avoir le nom complet de la classe
        // FQCN => Full Qualified Class Name
        $controllerName = '\memory\Controllers\\'.$controllerName;

        // Instanciation du controller
        $myController = new $controllerName($this->router);

        // Exécution de la méthode du controller précédemment défini
        $myController->$methodName($params);
    }

    private function defineRoutes()
    {
        // $this->router->map('Méthode HTTP', 'Endpoint', 'nom_du_controlleur#nom_de_la_méthode', 'nom_de_la_route_unique');
        $this->router->map('GET', '/', 'ScoreController#index', 'score_index');
        $this->router->map('POST', '/score/save', 'ScoreController#save', 'score_save');
    }
}
