<div class="wrapper">
    <header class="header">
        <div class="header__content">
            <h1 class="title">Jeu du memory</h1>

            <button id="play-game" class="btn btn-primary" type="submit">Jouer</button>

            <div class="player dnone">
                <p class="player__count-founded-pair">0 paire trouvée</p>
            </div>

            <div class="action-game dnone">
                <button id="restart-game" class="btn btn-primary" type="submit">Recommencer</button>
                <button id="exit-game" class="btn btn-danger" type="submit">Quitter</button>
            </div>
        </div>
    </header>
    
    <main class="main">
        <!-- div contenant le tableau d'affichage des 10 meilleurs scores -->
        <div class="best-score-list">
            <table class="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Pseudo</th>
                        <th>Temps (s)</th>
                        <th>Paires trouvées</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                        // Test si le tableau de scores envoyé à la vue (via ScoreController) est vide
                        // Si il n'est pas vide alors on boucle sur le tableau pour affichage
                        if (!empty($scores)):
                            // Déclaration d'une variable $index, initialisée à 1, pour afficher le classement du joueur
                            $index = 1;
                            // Boucle foreach pour afficher chacun des résultats
                            foreach ($scores as $current_score):
                            ?>
                                <tr>
                                    <td><?= $index; ?></td>
                                    <!-- Récupération du nom du joueur grâce à la méthode définie dans ScoreModel -->
                                    <td><?= $current_score->getName(); ?></td>
                                    <!-- Récupération du temps mis par le joueur grâce à la méthode définie dans ScoreModel -->
                                    <td><?= $current_score->getDuration(); ?></td>
                                    <!-- Récupération du nombre de paire trouvée par le joueur grâce à la méthode définie dans ScoreModel -->
                                    <td><?= $current_score->getCountFoundedPair(); ?></td>
                                    <!-- Récupération de la date à laquelle le joueur a joué grâce à la méthode définie dans ScoreModel -->
                                    <!-- formattage de la date grâce à la méthode date de php https://www.php.net/manual/fr/function.date -->
                                    <td><?= date("d-m-Y", strtotime($current_score->getCreatedAt())); ?></td>
                                </tr>
                            <?php
                            // Incrémentation de $index (1er tour: $index == 1; 2ème tour: $index == 2...)
                            $index++;
                            endforeach;
                        // Si le tableau de résultats est vide
                        else:
                            ?>
                                <tr>
                                    <td colspan="5">----- Pas encore de joueurs -----</td>
                                </tr>
                            <?php
                        endif;
                    ?>
                </tbody>
            </table>
        </div>

        <!-- Zone de contenu des cartes de jeu (affichage gérée en js) -->
        <div class="cards dnone"></div>

        <div class="progressbar dnone">
            <div class="progressbar-container">
                <div class="progressbar-item"></div>
            </div>
        </div>

        <!-- Fenêtre modale de fin de jeu (affichage gérée en js) -->
        <aside class="endgame dnone" aria-hidden="true" role="dialog"></aside>
    </main>
</div> <!-- /wrapper -->

<div class="wrapper-too-short">
    <h2>Oups !</h2>
    <h3>L'écran est trop petit pour jouer... il va falloir trouver plus grand !</h3>
</div>

<script src="js/app.js"></script>