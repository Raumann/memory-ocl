var app = {

  // Création d'une variable dans lequelle nous stockerons différents élements pour y accéder dans tout le fichier par app.elements
  elements: [],

  // Valeurs par défaut de la barre de progression
  progressBarValues: {
    start: 0,
    end: 180, // Temps en seconde alloué au joueur pour trouver les 14 paires
  },
  
  // Fonction appelée au moment de la création du DOM
  // cf. tout en bas => document.addEventListener('DOMContentLoaded', app.init);
  init: function() {
    // Création d'un écouteur sur le bouton "jouer" de la page d'accueil
    // La méthode addEventListener permet d'ajouter un écouteur sur l'élément ciblé
    // En 1er paramètre, on lui spécifie le type d'événement à écouter : ici un clic sur l'élément
    // En 2nd paramètre, on lui spéficie la fonction à appeler lorsque l'événement survient : ici handlePlayGame
    // https://developer.mozilla.org/fr/docs/Web/API/EventTarget/addEventListener
    document.getElementById('play-game').addEventListener('click', app.handlePlayGame);
  },

  // Modification de l'apparence de la page et appel de la fonction suivante 
  handlePlayGame: function() {
    // On cache le bouton jouer...
    // classList permet de récupérer les classes rattachées à un élément
    // https://developer.mozilla.org/fr/docs/Web/API/Element/classList
    // La méthode add permet d'ajouter une (ou plusieurs) classe à la liste
    // La méthode add prend en paramètre le nom de la classe que l'on souhaite ajouter
    document.getElementById('play-game').classList.add('dnone');

    // ...le tableau des meilleurs scores
    document.getElementsByClassName('best-score-list')[0].classList.add('dnone');

    // La méthode remove permet de retirer une (ou plusieurs) classe à la liste
    // On affiche la zone de "score" du joueur (0 paire trouvée)...
    document.getElementsByClassName('player')[0].classList.remove('dnone');

    // ...la zone de bouton "recommencer" et "quitter"...
    document.getElementsByClassName('action-game')[0].classList.remove('dnone');

    // ...la zone contenant les cartes...
    document.getElementsByClassName('cards')[0].classList.remove('dnone');

    // ...la barre de progression
    document.getElementsByClassName('progressbar')[0].classList.remove('dnone');

    // Initialisation des variables
    app.countFoundedPairs = 0;
    app.countError = 0;
    app.timeStartGame = 0;

    // Appel de la fonction responsable de la création et de la gestion de la logique du jeu
    app.generateGame();
  },

  // Fonction responsable de la création et de la gestion de la logique du jeu
  generateGame: function() {
    // Initialisation des variables
    app.nbClick = 0;
    app.selectImagePosition = [];
    app.selectImageId = [];
    
    // Création d'un tableau contenant les positions des images sur le png fourni (public/images/cards.png)
    var backgroundPosition = [];
    // 14 images...
    for (var index = 0; index < 14; index++) {
      // ...en 2 exemplaires chacune
      for (var j = 0; j < 2; j++) {
        backgroundPosition.push('-' + index * 100 + 'px');
      }
    }

    // Mélange aléatoire du tableau à l'aide de la fonction shuffleArray définie plus bas
    app.shuffleBackgroundPosition = app.shuffleArray(backgroundPosition);

    // Appel de la fonction responsable de la création des cartes du jeu
    app.generateCards();

    // Ajout des différents éléments du DOM dans la variable app.elements afin de pouvoir y faire appel dans les fonctions suivantes
    app.elements.card = document.getElementsByClassName("card");
    app.elements.exit = document.getElementById("exit-game");
    app.elements.restart = document.getElementById("restart-game");

    // Appel de la fonction responsable de la création des écouteurs sur les différents éléments
    app.createListeners();
  },

  // Fonction permettant de générer les cartes du jeu
  generateCards: function() {
    var divCards = document.getElementsByClassName('cards')[0];

    for (var index = 0; index < 28; index++) {

      // Si index est un multiple de 7 ou égal à 0 alors on créé une nouvelle rangée de carte
      if (index%7 == 0 || index == 0) {
        // La méthode createElement() permet de créer un nouvel élement
        // Elle prend en paramètre le type d'élément que l'on souhaite créer, ici une div
        // https://developer.mozilla.org/fr/docs/Web/API/Document/createElement
        var newRow = document.createElement("div");
        
        newRow.classList.add("card-row");
      }

      var newCard = document.createElement("div");
      newCard.classList.add("card-item");

      var newCardHidden = document.createElement("div");
      newCardHidden.classList.add("card-item__cache");
      newCardHidden.classList.add("visible");

      var newCardImage = document.createElement("div");
      newCardImage.classList.add("card-item__image");
      // Il est possible de modifier directement les attributs style d'un objet avec "style"
      // Ici on s'en sert pour définir quelle image sera affichée sur la carte
      // https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/style
      newCardImage.style.backgroundImage = "url('images/cards.png')";
      newCardImage.style.backgroundPosition = "0 " + app.shuffleBackgroundPosition[index];
      // La propriété dataset permet d'ajouter des données sur un élement
      // Cela permettra plus tard de savoir sur quelle carte le joueur a cliqué
      // https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/dataset
      newCardImage.dataset.position = app.shuffleBackgroundPosition[index];
      newCardImage.dataset.id = index;
      
      // La méthode appendChild ajoute l'élément passé en paramètre à l'élément ciblé
      // https://developer.mozilla.org/fr/docs/Web/API/Node/appendChild
      newCard.appendChild(newCardHidden);
      newCard.appendChild(newCardImage);
      
      newRow.appendChild(newCard);
      divCards.appendChild(newRow);

      // Ajout d'un event listener de type clic sur chacune des cartes, celui-ci déclenchera la fonction handleCard
      newCard.addEventListener('click', app.handleCard);
    }
  },

  // Fonction permettant de créer différents écouteurs...
  createListeners: function () {
    // ...sur l'ensemble des cartes...
    for (var index in app.elements.card) {

      var card = app.elements.card[index];

      if (typeof card === 'object') {

        card.addEventListener('click', app.handleCard);
      }
    }

    // ...le bouton recommencer...
    app.elements.restart.addEventListener('click', app.handleReplay);

    // ...et le bouton quitter
    app.elements.exit.addEventListener('click', app.handleExit);
  },

  handleCard: function(event) {
    // Si le chrono n'a pas encore été déclenché alors on l'initialise à la date actuelle
    if (app.timeStartGame == 0) {
      app.timeStartGame = new Date();

      // Récupération de la barre de progression et initilisation de sa largeur à 0% (width = 0% au départ)
      app.progressBar = document.getElementsByClassName('progressbar-item')[0];
      app.progressBarWidth = 0;

      // La méthode setInterval permet d'appeller une fonction (ici startProgressBar) à intervalle régulier
      // https://developer.mozilla.org/fr/docs/Web/API/WindowTimers/setInterval
      app.intervalID = window.setInterval(app.startProgressBar, 1000);
    }

    // On teste si la carte est déjà retournée
    // nextSibling permet de récupérer le noeud suivant dans un même noeud parent
    // https://developer.mozilla.org/fr/docs/Web/API/Node/nextSibling
    // Si la carte n'est pas encore retournée alors event.target.nextSibling retourne l'image visible
    // Si la carte est déjà retournée alors event.target.nextSibling retourne null et on arrête le script avec un return false
    if (event.target.nextSibling === null) {
      return false;
    }

    // Incrémentation de la variable représentant le nombre de clic du joueur de 1
    app.nbClick++;

    // Si le nombre de clic est inférieur à trois, autrement dit si le joueur a encore le droit de retourner une carte
    if (app.nbClick < 3) {

      // Si la carte est face cachée...
      if (event.target.className === 'card-item__cache visible') {
        // ...alors on masque le dos de la carte...
        event.target.classList.remove('visible');
        // ...on affiche l'image...
        event.target.nextSibling.classList.add('visible');
        // ...et on récupère les données rattachées à la carte (sa position et son id) que l'on stocke dans un tableau. Lorsque le joueur aura retourné 2 cartes, cela nous permettra de savoir si les 2 cartes retournées sont identiques ou non
        app.selectImagePosition.push(event.target.nextSibling.dataset.position);
        app.selectImageId.push(event.target.nextSibling.dataset.id);
      }
    }

    // Si le joueur a retourné deux cartes
    if (app.nbClick == 2) {

      // On teste si la 1ère image sélectionnée correspond à la 2nde
      if (app.selectImagePosition[0] == app.selectImagePosition[1]) {

        // Réinitilisation des variables
        app.nbClick = 0;
        app.selectImagePosition = [];
        app.selectImageId = [];

        // Si les images correspondent alors on incrémente de 1 la valeur du nombre de paire trouvée
        app.countFoundedPairs++;
        
        // Modification de l'affichage du nombre de paire trouvée
        // Sélection de la zone de texte...
        var divCountPairFounded = document.getElementsByClassName('player__count-founded-pair')[0];
        // ...distinction de l'affichage au singulier vs. pluriel
        if (app.countFoundedPairs === 1) {
          divCountPairFounded.textContent = app.countFoundedPairs + ' paire trouvée';
        } else {
          divCountPairFounded.textContent = app.countFoundedPairs + ' paires trouvées';
        }

        // Si toutes les paires ont été trouvées
        if (app.countFoundedPairs === 14) {
          // Arrêt de l'avancement de la progressbar et calcul du temps mis pour trouver les 14 paires
          app.stopChrono(true);
          // Affichage de la fenêtre modale de fin de jeu
          app.endGame(true);
        }
      } else {
        // Si les 2 images sélectionnées ne correspondent pas alors...
        // ...on incrémente le nombre d'erreur...
        app.countError++;
        // ...et on retourne les 2 cartes sélectionnées face cachée après un délai de 2s grâce à la méthode setTimeout
        // https://developer.mozilla.org/fr/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
        app.timeoutID = window.setTimeout(app.returnCard, 2000);
      }
    } 
  },

  endGame: function(victory) {
    // Récupération et affichage de la modale de fin de jeu
    var endGameModalWindow = document.getElementsByClassName("endgame")[0];
    endGameModalWindow.classList.remove('dnone');

    // Création de l'affichage
    // Div qui contiendra l'ensemble des éléments
    var newDivWrapper = document.createElement("div");
    newDivWrapper.classList.add("endgame-wrapper");

    // Div Titre
    var newTitle = document.createElement("h2");
    newTitle.classList.add("endgame-wrapper__title");

    // Div Message
    var newDivMessage = document.createElement("div");
    newDivMessage.classList.add("endgame-wrapper__message");

    // Div Detail
    var newDivDetail = document.createElement("div");
    newDivDetail.classList.add("endgame-wrapper__detail");
    newDivDetail.innerHTML = "Temps : <span class='endgame-wrapper__detail__time'></span> — Erreur(s) : <span class='endgame-wrapper__detail__error'></span>"

    // Div SaveMessage
    var newDivSaveMessage = document.createElement("div");
    newDivSaveMessage.classList.add("endgame-wrapper__save-message");
    newDivSaveMessage.textContent = "Entrez votre pseudo avant de cliquer sur rejouer ou quitter";

    // Form
    var newForm = document.createElement("form");
    newForm.classList.add("endgame-wrapper__form");
    newForm.method = "POST";

    // Form - Label
    var newLabelPseudo = document.createElement("label");
    newLabelPseudo.textContent = "Pseudo";
    newLabelPseudo.htmlFor = "pseudo";

    // Form - Input
    var newInputPseudo = document.createElement("input");
    newInputPseudo.setAttribute("id", "pseudo");
    newInputPseudo.setAttribute("name", "pseudo");
    newInputPseudo.setAttribute("type", "text");
    newInputPseudo.placeholder = "anonyme";

    // Form - Div Button
    var newDivButton = document.createElement("div");
    newDivButton.classList.add("endgame-wrapper__form__action");

    // Form - Button replay
    var newButtonReplay = document.createElement("button");
    newButtonReplay.setAttribute("id", "modal-replay-game");
    newButtonReplay.setAttribute("type", "submit");
    newButtonReplay.classList.add("btn", "btn-primary");
    newButtonReplay.innerHTML = "Rejouer";

    // Ajout d'un écouteur sur le bouton rejouer nouvellement créé
    newButtonReplay.addEventListener('click', app.handleSubmitScore);

    // Form - Button exit
    var newButtonExit = document.createElement("button");
    newButtonExit.setAttribute("id", "modal-exit-game");
    newButtonExit.setAttribute("type", "submit");
    newButtonExit.classList.add("btn", "btn-danger");
    newButtonExit.innerHTML = "Quitter";

    // Ajout d'un écouteur sur le bouton rejouer nouvellement créé
    newButtonExit.addEventListener('click', app.handleSubmitScore);

    // Ajout des boutons replay et exit à la div button du form
    newDivButton.appendChild(newButtonReplay);
    newDivButton.appendChild(newButtonExit);

    // Ajout du label, de l'input et de la div button au form
    newForm.appendChild(newLabelPseudo);
    newForm.appendChild(newInputPseudo);
    newForm.appendChild(newDivButton);
    
    // Ajout de l'ensemble des éléments à la div créée au départ
    newDivWrapper.appendChild(newTitle);
    newDivWrapper.appendChild(newDivMessage);
    newDivWrapper.appendChild(newDivDetail);
    newDivWrapper.appendChild(newDivSaveMessage);
    newDivWrapper.appendChild(newForm);

    // Ajout de la div à la fenêtre modale
    endGameModalWindow.appendChild(newDivWrapper);


    // Gestion du titre et du message à afficher selon que le joueur ait gagné (trouvé les 14 paires) ou perdu
    if (victory) {
      newTitle.textContent = "Victoire";
      newDivMessage.textContent = "Félicitations, vous avez trouvé les 14 paires";
    } else {
      newTitle.textContent = "Dommage";
      // Gestion singulier vs pluriel selon le nombre de paires trouvées
      if (app.countFoundedPairs <= 1) {
        newDivMessage.textContent = "Encore un effort, vous avez trouvé " + app.countFoundedPairs + " paire";
      } else {
        newDivMessage.textContent = "Encore un effort, vous avez trouvé " + app.countFoundedPairs + " paires";
      }
    }

    // Récupération de la zone de texte et affichage du temps de jeu du joueur...
    var endGameChrono = document.getElementsByClassName("endgame-wrapper__detail__time")[0];
    if (victory) {
      // Récupération du temps calculé par la méthode stopChrono()
      endGameChrono.textContent = app.timeToFinish + "s";
    } else {
      // Récupération de la variable stockée au début du script, à l'initialisation de la progressbar
      endGameChrono.textContent = app.progressBarValues.end + "s";
    }

    // Récupération de la zone de texte et affichage du nombre d'erreur
    var endGameError = document.getElementsByClassName("endgame-wrapper__detail__error")[0];
    endGameError.textContent = app.countError;
  },

  // Réinitialisation des variables et regénération du jeu
  handleReplay: function() {
    app.stopChrono();
    
    app.handleReinitialisation();

    app.handlePlayGame();
  },

  // Réinitialisation des variables et retour à la page d'accueil
  handleExit: function() {
    app.handleReinitialisation();

    // On recharge la page afin d'être sûr que les scores soient bien mis à jour
    document.location.reload(true);
  },

  // Réinitilisation des variables
  handleReinitialisation: function() {
    document.getElementById("play-game").classList.remove("dnone");

    document.getElementsByClassName("cards")[0].innerHTML = "";
    document.getElementsByClassName("cards")[0].classList.add("dnone");

    document.getElementsByClassName("progressbar")[0].classList.add("dnone");
    document.getElementsByClassName("progressbar-item")[0].style.width = "0%";
    document.getElementsByClassName("progressbar-item")[0].style.backgroundColor = "#baf2bb";

    document.getElementsByClassName("endgame")[0].innerHTML = "";
    document.getElementsByClassName("endgame")[0].classList.add("dnone");

    
    document.getElementsByClassName("player")[0].classList.add("dnone");
    document.getElementsByClassName('player__count-founded-pair')[0].textContent = "0 paire trouvée";

    document.getElementsByClassName("action-game")[0].classList.add("dnone");

    document.getElementsByClassName("best-score-list")[0].classList.remove("dnone");
  },

  // Retourne les cartes face cachée
  returnCard: function() {
    // Récupération de l'ensemble des images
    var images = document.getElementsByClassName('card-item__image');

    // Parcours de l'ensemble des images
    for (var index = 0; index < images.length; index++) {

      // Si l'image actuellement parcourue dans la boucle a un attribut id identique à celui de l'image sélectionnée (donc retournée) par le joueur alors on remet l'image face cachée
      if (images[index].dataset.id === app.selectImageId[0] || images[index].dataset.id === app.selectImageId[1]) {
        images[index].classList.remove('visible');
        // previousSibling permet de récupérer le noeud précédent dans un même noeud parent
        // https://developer.mozilla.org/fr/docs/Web/API/Node/previousSibling
        images[index].previousSibling.classList.add('visible');
      }
    }

    // Réinitilisation des variables
    app.nbClick = 0;
    app.selectImagePosition = [];
    app.selectImageId = [];
  },

  // Chargement de la barre de progression
  startProgressBar: function() {
    // Calcul le pas d'avancement de la barre de progression
    app.calcStepProgressBar();
    
    // On redéfinit la taille de la barre de progression
    app.progressBarWidth = app.progressBarWidth + app.step;
    app.progressBar.style.width = app.progressBarWidth + "%";

    // Si la taille de la barre de progression atteint les 100% de sa taille maximale alors...
    if (app.progressBarWidth >= 100) {
      // ...arrêt de l'avancement de la progressbar et arrêt du chronomètre...
      app.stopChrono(false);
      // ...et on arrête le jeu en affichant la fenêtre modale de fin en passant en paramètre le fait que le joueur ait perdu
      app.endGame(false);
    } else if (app.progressBarWidth > 33 && app.progressBarWidth < 66) {
      // Modification de la couleur de la barre de progression (orange)
      app.progressBar.style.backgroundColor = "#f06449";
    } else if (app.progressBarWidth >= 66) {
      // Modification de la couleur de la barre de progression (rouge)
      app.progressBar.style.backgroundColor = "#de1a1a";
    }
  },

  // Calcul du pas de progression de la barre de progression
	calcStepProgressBar: function (){
    // Récupération de la largeur en pixels du container de la barre de progression
    var widthProgressBarContainer = document.getElementsByClassName('progressbar-container')[0].clientWidth;

    // Récupération de l'équivalent en pixel d'une seconde d'avancement
    // Par exemple : si le container fait 500 pixels de large et que le joueur a 500 s pour trouver les 14 paires
    // Alors stepPixel = 500px / 500s = 1px/s
    var stepPixel = (widthProgressBarContainer * 1) / app.progressBarValues.end;

    // Conversion de la valeur en pixels en %
    app.step = (stepPixel * 100) / widthProgressBarContainer;
  },
  
  // Arrêt du délai de retournement de carte, de l'avancement de la progressbar et caclul du temps de jeu de l'utilisateur
  stopChrono: function(victory) {
    // On stoppe le setTimeout responsable du délai entre le moment où le joueur a retourné deux cartes qui ne forment pas une paire et le moment où il peut de nouveau retourner une carte...
    // important car si l'utilisateur clique juste après s'être trompé sur le bouton recommencer et qu'il reclique sur une carte dans le délai imparti cela créé un bug
    clearTimeout(app.timeoutID);

    // ...arrêt de la progressbar...
    // La méthode clearInterval permet d'arrêter l'action initialisée par setInterval
    // https://developer.mozilla.org/fr/docs/Web/API/WindowTimers/clearInterval
    clearInterval(app.intervalID);

    // ...détermination du temps de jeu
    if (victory) {
      // Si victoire (14 paires trouvées) alors on calcule le temps mis par l'utilisateur pour les trouver
      var timeEndGame = new Date();
      app.timeToFinish = Math.round((timeEndGame - app.timeStartGame) / 1000);
    } else {
      // Sinon temps de jeu alloué à l'utilisateur (variable initialisée au début)
      app.timeToFinish = app.progressBarValues.end;
    }
  },

  // Permet de mélanger un tableau de manière aléatoire
  shuffleArray: function(arrayBackgroundPosition) {
    var j, x, i;
    
    for (i = arrayBackgroundPosition.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = arrayBackgroundPosition[i];
        arrayBackgroundPosition[i] = arrayBackgroundPosition[j];
        arrayBackgroundPosition[j] = x;
    }
    
    return arrayBackgroundPosition;
  },

  // Création du score en bdd
  handleSubmitScore: function(event) {
    // On empêche le rechargement de la page (inhérent au fait de cliquer sur un boutou de type submit d'un formulaire)
    event.preventDefault();

    // Permet de savoir si on a cliqué sur le bouton "rejouer" ou "quitter"
    // Utile pour la redirection une fois que le score a été stocké dans la bdd
    app.originAction = event.target.id;

    // Création d'un ensemble de paires clé / valeur qui représentent les champs du formulaire et leurs valeurs, qui peuvent ensuite être facilement envoyés à l'aide de la méthode send() un peu plus bas
    // https://developer.mozilla.org/fr/docs/Web/API/FormData
    var formData = new FormData();
    // Vérification si l'input pseudo est rempli
    if (event.target.form.pseudo.value.trim() == '') {
      // Si non alors on lui donne la valeur anonyme
      formData.append('pseudo', 'anonyme');
      // Autre possibilité arrêter le script et ainsi obliger l'utilisateur à rentrer un pseudo (contraignant+++) => il faudrait alors ajouter un affichage pour que l'utilisateur sache ce qui ne va pas (user experience)
      // return false
    } else {
      // Si oui alors on lui donne la valeur saisie par l'utilisateur (à laquelle on retire les espaces avant et après à l'aide de la méthode trim())
      formData.append('pseudo', event.target.form.pseudo.value.trim());
    }
      
    // Ajout des autres données
    formData.append('duration', app.timeToFinish);
    formData.append('count_founded_pair', app.countFoundedPairs);
    formData.append('count_error', app.countError);

    // Création de la requête Http
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function()
    {
      // Si la requête s'est bien passée...
      if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
      {
        // ...si l'utilisateur a cliqué sur le bouton "rejouer" alors on appelle la méthode handleReplay() pour réinitialiser le jeu
        if (app.originAction == "modal-replay-game") {
          app.handleReplay();
        } else {
          // ...sinon on recharge la page (ce qui permet de renvoyer l'utilisateur sur la page d'accueil et d'avoir la liste des meilleurs scores mise à jour)
          document.location.reload(true);
        }
      }
    }

    // Création et envoi de la requête
    // Le premier argument est le type de requête (GET, POST, PUT, DELETE, etc.)
    // Le second argument est l'url à pointer (= endpoint)
    // Ici, on envoie une requête de type post en appelant l'url qui se chargera d'appeller à son tour la méthode save du controller scoreController (voir les routes dans Application.php)
    xmlHttp.open("post", "http://51.178.19.224/memory-ocl/public/score/save");
    // Ajout des données à envoyer
    xmlHttp.send(formData);
  },
};

// A la fin du chargement du DOM on appelle la méthode init()
document.addEventListener('DOMContentLoaded', app.init);
