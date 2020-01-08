<?php

namespace memory\Models;

use PDO;
use memory\Utils\Database;

/**
 * Le mot-clé abstract permet d'indiquer à PHP que cette classe est dite "abstraite"
 * Autrement dit, l'instanciation directe de cette classe est INTERDITE
 * Elle peut seulement être étendue
 */
abstract class CoreModel
{
    protected $id;
    protected $created_at;
    protected $updated_at;

    /**
     * Cette méthode sera disponible pour l'ensemble des classes qui étendent le CoreModel
     */
    public static function findAll()
    {
        // Déclaration de la requête SQL
        $sql = 'SELECT * FROM '.static::TABLE_NAME.';';

        // Appel de la méthode static getPDO afin de récupérer l'instance de la bdd puis exécution de la requête SQL
        // query retourne un jeu de résultats en tant qu'objet PDOStatement
        // https://www.php.net/manual/fr/pdo.query.php
        $pdoStatement = Database::getPDO()->query($sql);

        // Retourne un tableau contenant toutes les enregistrements trouvés
        // PDO::FETCH_CLASS permet de préciser sous quelle forme l'on veut que PDOStatement nous retourne le résultat
        // PDOStatement retournera une nouvelle instance de la classe demandée (selon le modèle depuis lequel on fait appel à la méthode findAll) en liant les résultats aux noms des propriétés de la classe
        // https://www.php.net/manual/fr/pdostatement.fetchall
        return $pdoStatement->fetchAll(PDO::FETCH_CLASS, static::class);
    }

    /**
     * Get the value of id
     */ 
    public function getId()
    {
        return $this->id;
    }

    /**
     * Get the value of created_at
     */ 
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * Get the value of updated_at
     */ 
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }
}
