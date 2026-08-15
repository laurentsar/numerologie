/*
 * tarot.js — donnees du tirage de cartes (tarot).
 *
 * 78 cartes (22 arcanes majeurs + 56 arcanes mineurs) avec mots-cles courts,
 * et une serie de tirages (positions a interpreter). Aucune dependance,
 * aucun calcul complexe : de la donnee statique + un tirage aleatoire.
 *
 * Expose window.Tarot = { deck, spreads, tirer }.
 */
(function () {
  'use strict';

  // Arcanes majeurs (0 a 21)
  var majeurs = [
    { nom: 'Le Mat', motsCles: 'espoir neuf, prendre des risques, nouveaux departs' },
    { nom: 'Le Bateleur', motsCles: 'creativite ciblee, une vision qui devient reelle, action inspiree' },
    { nom: "La Papesse", motsCles: 'secrets, mystere, intuition, faire confiance a soi' },
    { nom: "L'Imperatrice", motsCles: 'fertilite, creation, abondance, bonne parentalite' },
    { nom: "L'Empereur", motsCles: 'respect, leadership, strategie, figure paternelle' },
    { nom: 'Le Pape', motsCles: 'traditions, attentes conventionnelles, conformite' },
    { nom: "L'Amoureux", motsCles: 'partenariat, amour profond, un choix, la force du duo' },
    { nom: 'Le Chariot', motsCles: 'action et changement, un voyage, un nouveau vehicule' },
    { nom: 'La Force', motsCles: 'amour de soi, amour inconditionnel, respect de soi, courage' },
    { nom: "L'Hermite", motsCles: 'aller chercher en soi, quete de verite personnelle, illumination' },
    { nom: 'La Roue de Fortune', motsCles: 'bonne fortune, un tournant, chance au jeu' },
    { nom: 'La Justice', motsCles: 'cause a effet, solutions gagnant-gagnant, la verite eclate' },
    { nom: 'Le Pendu', motsCles: 'sagesse, sacrifice de soi, changer de perspective' },
    { nom: "L'Arcane sans nom", motsCles: 'grands changements, fins, passer a autre chose, renaissance' },
    { nom: 'Temperance', motsCles: 'equilibre, harmonie, patience, moderation' },
    { nom: 'Le Diable', motsCles: 'dependance, avidite, envie, materialisme, obsession' },
    { nom: 'La Maison Dieu', motsCles: 'changement non desire, bouleversement, ruine, rupture' },
    { nom: "L'Etoile", motsCles: 'renouveau, espoir, clarte interieure, avoir foi' },
    { nom: 'La Lune', motsCles: 'problemes caches, changements volontaires, ecouter son intuition' },
    { nom: 'Le Soleil', motsCles: 'bonheur concret, issue joyeuse, reussite' },
    { nom: 'Le Jugement', motsCles: 'clarte, une decision finale, un signal de reveil, sa raison d\'etre' },
    { nom: 'Le Monde', motsCles: 'accomplir un but ou une lecon, depart, voyage, achevement' }
  ];

  // Arcanes mineurs : 4 familles x 14 cartes (As a Roi)
  var rangs = ['As', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit', 'Neuf', 'Dix', 'Valet', 'Cavalier', 'Reine', 'Roi'];

  var familles = {
    coupes: {
      nom: 'Coupes', theme: 'eau · emotions',
      motsCles: [
        'nouvelle naissance ou relation, demande en mariage, mariage',
        'amour naissant, partenariat, demande en mariage, mariage',
        'amitie, celebrations, un cercle de soutien',
        'apathie, sentiment d\'inassouvissement, cadeau surprise',
        'perte, regret, chagrin, se sentir delaisse ou mal aime',
        'nostalgie, cadeaux, innocence, retrouvailles',
        'trop de choix, difficulte a s\'engager',
        'retrait, repli, tourner la page, abandon',
        'voeux exauces, abondance materielle, bonne sante',
        'contentement familial, amour et soutien total',
        'un enfant studieux, un nouvel amour, benevolat',
        'un prince ou une princesse charmante, romance, demande',
        'une personne nourriciere, guerison, soutien',
        'un leader bienveillant, tolerance, empathie'
      ]
    },
    deniers: {
      nom: 'Deniers', theme: 'terre · materiel',
      motsCles: [
        'nouvel emploi, augmentation, promotion, investissement',
        'deux choix, jongler entre plusieurs options',
        'travail d\'equipe, collaboration, competence, savoir-faire',
        'avidite ou besoin de securite a long terme',
        'sante fragile, precarite, inquietude, isolement, perte financiere',
        'donner ou recevoir de l\'aide, generosite',
        'patience, travail acharne, reussite differee, attendre',
        'maitriser son art, s\'epanouir dans son travail',
        'luxe, autosuffisance, gain financier',
        'laisser un heritage, retraite, transmission',
        'un enfant patient, une nouvelle situation, une bonne nouvelle financiere',
        'une personne fiable, patience, travail assidu',
        'une personne debrouillarde, fertilite, sens du foyer',
        'un leader solide et pragmatique, investisseur avise'
      ]
    },
    epees: {
      nom: 'Epees', theme: 'air · intellect',
      motsCles: [
        'idees nouvelles, nouveau conflit, chirurgie, clarte mentale',
        'temps du compromis ou de la decision',
        'chagrin, rupture, perte, depression, chirurgie',
        'repli, repos, renouveau, solitude, convalescence',
        'brimades, vol, violence, relations toxiques',
        'une transition necessaire, demenagement',
        'vol, trahison, malhonnetete, fuite',
        'restrictions auto-imposees, isolement, sentiment d\'enfermement',
        'cauchemars, anxiete, chagrin, depression',
        'une fin douloureuse et complete, toucher le fond',
        'un enfant curieux, ragots, indiscretion, verite qui sort',
        'une personne au verbe rapide, changement de vie',
        'une personne autonome, honnetete totale',
        'un leader strategique et volontaire'
      ]
    },
    batons: {
      nom: 'Batons', theme: 'feu · creativite',
      motsCles: [
        'nouveau projet, inspiration, l\'envie de creer',
        'attendre des resultats, faire un choix, projets de voyage',
        'travail d\'equipe, commerce, expansion, voyage',
        'retour au foyer, celebrations, famille, amis, retrouvailles',
        'rivalite, defis, obstacles, competition',
        'victoire, reconnaissance, bonnes nouvelles, succes',
        'defense de soi, se proteger de la concurrence',
        'rapidite, action, changement soudain, nouvelles qui arrivent',
        'poser et tenir ses limites, perseverance',
        'stress, epuisement, trop de charges a porter',
        'un enfant actif, un nouveau projet ou une idee creative',
        'une personne passionnee et libre, creativite',
        'une personne fougueuse, confiance, assurance',
        'un leader audacieux, pouvoir, charme, courage'
      ]
    }
  };

  var deck = [];
  majeurs.forEach(function (c, i) {
    deck.push({ id: 'M' + i, nom: c.nom, famille: 'Arcane majeur', numero: i, motsCles: c.motsCles });
  });
  Object.keys(familles).forEach(function (fk) {
    var f = familles[fk];
    rangs.forEach(function (rang, i) {
      var liaison = /^[AEIOUÉ]/.test(f.nom) ? 'd\'' : 'de ';
      deck.push({
        id: fk + i,
        nom: rang + ' ' + liaison + f.nom,
        famille: f.nom + ' (' + f.theme + ')',
        numero: i + 1,
        motsCles: f.motsCles[i]
      });
    });
  });

  // ------------------------------- tirages ----------------------------------
  var spreads = [
    {
      id: 'celtique',
      nom: 'Croix celtique modifiee',
      positions: [
        'Situation actuelle', 'Obstacle / influence contraire', 'Influence inconsciente',
        'Passe lointain', 'But / objectif', 'Passe proche', 'Perception de soi',
        'Influences exterieures', 'Conseil / ce qu\'il faut faire', 'Resultat probable'
      ]
    },
    {
      id: 'guides',
      nom: 'Cercle des guides spirituels',
      positions: [
        'Ce qui represente le guide', 'Message du guide pour maintenant',
        'Ce que le guide essaie de te faire remarquer', 'Comment il t\'accompagne sur ton chemin',
        'Ce a quoi rester receptif dans le futur'
      ]
    },
    {
      id: 'relation',
      nom: 'Dynamique relationnelle',
      positions: ['Toi', 'L\'autre', 'La relation', 'Conseil', 'Resultat']
    },
    {
      id: 'jour',
      nom: 'Bilan du jour',
      positions: ['Energie du jour', 'Point d\'attention', 'Ce qu\'il faut lacher']
    },
    {
      id: 'ancetres',
      nom: 'Connexion aux ancetres',
      positions: [
        'L\'ancetre / l\'energie ancestrale', 'Message', 'Don ou talent transmis',
        'Poids a laisser', 'Lien qui perdure'
      ]
    },
    {
      id: 'ombre',
      nom: 'Travail de l\'ombre profonde',
      positions: ['Element declencheur', 'Cause profonde', 'Action de guerison', 'Integration']
    },
    {
      id: 'vieanterieure',
      nom: 'Chemin d\'une vie anterieure',
      positions: [
        'Energie que tu portais', 'Message a valider depuis l\'enfance',
        'Lien ou relation qui te guide', 'Schema de pensee qui te freine',
        'Etape a franchir', 'Lecon apprise', 'Effet de cette lecon aujourd\'hui'
      ]
    },
    {
      id: 'decision',
      nom: 'Tirage de decision',
      positions: ['Situation actuelle', 'Voie de l\'option A', 'Voie de l\'option B', 'Meilleure ligne de conduite']
    },
    {
      id: 'nouvellelune',
      nom: 'Intention de nouvelle lune',
      positions: ['Ce qu\'il faut lacher', 'Ce qu\'il faut attirer', 'Etape a franchir']
    }
  ];

  function tirer(spreadId) {
    var spread = spreads.filter(function (s) { return s.id === spreadId; })[0];
    if (!spread) return null;
    var pioche = deck.slice();
    for (var i = pioche.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = pioche[i]; pioche[i] = pioche[j]; pioche[j] = tmp;
    }
    var tirage = spread.positions.map(function (label, i) {
      return { position: label, carte: pioche[i] };
    });
    return { spread: spread, tirage: tirage };
  }

  window.Tarot = { deck: deck, spreads: spreads, tirer: tirer };
})();
