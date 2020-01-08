<?php

namespace memory\Models;

use PDO;
use memory\Utils\Database;

class ScoreModel extends CoreModel
{
    protected $name;
    protected $duration;
    protected $count_founded_pair;
    protected $count_error;

    const TABLE_NAME = 'score';

    /**
     * Méthode permettant de récupérer les 10 meilleurs scores stockés en bdd
     * Résultats triés selon le nombre de pairs trouvées (du plus vers le moins => DESC), puis par la durée (de la plus petite à la plus grande valeur ASC), puis par le nombre d'erreur (de la plus petite à la plus grande valeur ASC)
     * Récupération des 10 premiers résultats => LIMIT 10
     */
    public static function findTenBestScore()
    {
        // Déclaration de la requête SQL
        $sql = 'SELECT * FROM score ORDER BY count_founded_pair DESC, duration, count_error LIMIT 10;';

        // Appel de la méthode static getPDO afin de récupérer l'instance de la bdd puis exécution de la requête SQL
        // query retourne un jeu de résultats en tant qu'objet PDOStatement
        // https://www.php.net/manual/fr/pdo.query.php
        $pdoStatement = Database::getPDO()->query($sql);

        // Retourne un tableau contenant tous les enregistrements trouvés
        // PDO::FETCH_CLASS permet de préciser sous quelle forme on veut que PDOStatement nous retourne le résultat
        // Ici, PDOStatement retourne une nouvelle instance de la classe demandée (ici ScoreModel) en liant les résultats aux noms des propriétés de la classe
        // https://www.php.net/manual/fr/pdostatement.fetchall
        return $pdoStatement->fetchAll(PDO::FETCH_CLASS, static::class);
    }

    public function insert()
    {
        // Insertion à l'aide d'une requête préparée afin d'optimiser l'exécution et éviter les injections SQL
        // https://www.php.net/manual/fr/pdo.prepared-statements.php
        
        // Déclaration de la requête SQL
        $sql = 'INSERT INTO `score` (`name`, `duration`, `count_founded_pair`, `count_error`) VALUES (:insertName, :insertDuration, :insertCountFoundedPair, :insertCountError);';

        // Préparation de la requête précédemment définie qui ne sera exécutée que lorsque l'on fera appel à la méthode execute (voir plus bas)
        // https://www.php.net/manual/fr/pdo.prepare.php
        $pdoStatement = Database::getPDO()->prepare($sql);

        // Remplacement des paramètres 
        // bindValue va "remplir" les paramètres définis dans la déclaration $sql juste au-dessus (:insertName, :insertDuration, ...)
        // en récupérant les valeurs correspondantes au modèle grâce aux getters ($this->getName(), $this->getDuration(), ...)
        // en spécificiant si il s'agit d'une variable de type string (PARAM_STR) ou d'un entier (PARAM_INT)
        // https://www.php.net/manual/fr/pdostatement.bindvalue.php
        $pdoStatement->bindValue(':insertName', $this->getName(), PDO::PARAM_STR);
        $pdoStatement->bindValue(':insertDuration', $this->getDuration(), PDO::PARAM_INT);
        $pdoStatement->bindValue(':insertCountFoundedPair', $this->getCountFoundedPair(), PDO::PARAM_INT);
        $pdoStatement->bindValue(':insertCountError', $this->getCountError(), PDO::PARAM_INT);

        // Insertion en bdd
        // execute permet d'exécuter une requête préparée
        // https://www.php.net/manual/fr/pdostatement.execute.php
        if ($pdoStatement->execute()) {
            
            // Retourne le nombre de lignes affectées
            // https://www.php.net/manual/fr/pdostatement.rowcount.php
            return $pdoStatement->rowCount() > 0;
        } else {
            return false;
        };
    }

    /**
     * Get the value of name
     */ 
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set the value of name
     *
     * @return  self
     */ 
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get the value of duration
     */ 
    public function getDuration()
    {
        return $this->duration;
    }

    /**
     * Set the value of duration
     *
     * @return  self
     */ 
    public function setDuration($duration)
    {
        $this->duration = $duration;

        return $this;
    }

    /**
     * Get the value of count_founded_pair
     */ 
    public function getCountFoundedPair()
    {
        return $this->count_founded_pair;
    }

    /**
     * Set the value of count_founded_pair
     *
     * @return  self
     */ 
    public function setCountFoundedPair($count_founded_pair)
    {
        $this->count_founded_pair = $count_founded_pair;

        return $this;
    }

    /**
     * Get the value of count_error
     */ 
    public function getCountError()
    {
        return $this->count_error;
    }

    /**
     * Set the value of count_error
     *
     * @return  self
     */ 
    public function setCountError($count_error)
    {
        $this->count_error = $count_error;

        return $this;
    }
}