<?php

namespace memory\Controllers;

// Controlleur général duquel hériteront les autres controlleurs
class CoreController
{
    private $listVars = array();
    protected $router;

    public function __construct($router)
    {
        // Récupération du router
        $this->router = $router;

        // Récupération de la BASE URI mise en place via le .htaccess
        $baseUrl = isset($_SERVER['BASE_URI']) ? trim($_SERVER['BASE_URI']) : '/';

        // Assignation de variables automatiquement pour les views
        // Comme ça router et baseUrl sont directement disponibles dans les views et peuvent être utilisés
        $this->assign('router', $this->router);
        $this->assign('baseUrl', $baseUrl);
    }

    /**
     * assign permet de stocker des variables pour pouvoir les récupérer ensuite dans les views
     */
    protected function assign($varName, $varValue)
    {
        $this->listVars[$varName] = $varValue;
    }

    protected function show($viewName)
    {
        // Boucle sur les variables à ajouter à la vue
        foreach ($this->listVars as $varName => $varValue)
        {
            // Le double $ permet de récupérer le nom de la variable
            // Si le nom de la variable $varName est toto et sa valeur 'toto'
            // Alors $$varName = $varValue équivaut à $toto = 'toto'
            $$varName = $varValue;
        }

        // Inclusion des views
        include __DIR__ . '/../views/header.tpl.php';
        include __DIR__ . '/../views/' . $viewName . '.tpl.php';
        include __DIR__ . '/../views/footer.tpl.php';
    }
}
