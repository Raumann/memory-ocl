<?php

namespace memory\Utils;

use PDO;

class Database
{
    public $dbh;

    private static $_instance;

    /**
     * Constructeur se connectant à la base de données à partir des informations du fichier de configuration
     */
    public function __construct()
    {
        // Récupération des données du fichier de config (dbconfig.conf)
        // La fonction parse_ini_file parse le fichier et retourne un array associatif
        $configData = parse_ini_file(__DIR__ . '/../dbconfig.conf');

        // Bloc try... catch... => try to do this instruction (essaie de faire cette instruction) catch an error if it fails (attrape une erreur si l'instruction du try échoue)
        try {
            // https://www.php.net/manual/fr/pdo.construct.php
            $this->dbh = new PDO(
                "mysql:host={$configData['DB_HOST']};dbname={$configData['DB_NAME']};charset=utf8",
                $configData['DB_USERNAME'],
                $configData['DB_PASSWORD'],
                array(PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING) // Affiche les erreurs SQL à l'écran
            );
        } catch (\Exception $exception) {
            echo 'Erreur de connexion...<br>';
            echo $exception->getMessage() . '<br>';
            echo '<pre>';
            echo $exception->getTraceAsString();
            echo '</pre>';
            exit;
        }
    }

    /**
     * La fonction getPDO est static, elle peut être exécutée sans instancier la classe Database (pas besoin de faire new Database)
     * Attention, besoin nénmoins de faire un use de Database pour pouvoir utiliser la fonction en static => Database::getPDO()
     */
    public static function getPDO()
    {
        // Pattern singleton
        // Si $instance n'existe pas alors la classe s'instancie elle-même avec un new Database...
        // Sinon la fonction retourne l'instance déjà créé précédemment
        if (empty(self::$_instance))
        {
            self::$_instance = new Database();
        }

        return self::$_instance->dbh;
    }
}