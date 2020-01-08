<?php

namespace memory\Controllers;

class ErrorController extends CoreController
{
    public function Error404()
    {
        // Affichage de la view
        $this->show('error404');
    }
}
