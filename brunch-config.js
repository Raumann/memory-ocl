// See http://brunch.io for documentation.
module.exports = {
  files: {
    // Je demande à Brunch de compiler mes fichiers js...
    javascripts: {
      joinTo: {
        // ...dans app.js si le fichier d'origine se trouve dans le dossier "client"
        'js/app.js': /^client/,
        // ...dans vendor.js si le fichier d'origine se trouve dans le dossier "node_module"
        'js/vendor.js': /^node_modules/
      }
    },

    // Je demande à Brunch de compiler mes fichiers css...
    stylesheets: {
      joinTo: {
        // ...dans app.css si le fichier d'origine se trouve dans le dossier "client"
        'css/app.css': /^client/,
        // ...dans vendor.css si le fichier d'origine se trouve dans le dossier "node_module"
        'css/vendor.css': /^node_modules/
      }
    },
  },

  // Je demande à Brunch de surveiller le dossier client
  paths: {
    watched: ['client'],
  },

  modules: {
    // Je renomme le chemin de recherche des fichiers (au lieu de app par défault, ici je lui demande de regarder dans le dossier client)
    nameCleaner: path => path.replace(/^client\//, ''),

    autoRequire: {
      // Permet d'éviter d'écrire dans index.html => <script>require('initialize')</script>
      'js/app.js': ['initialize']
    }
  }
};

