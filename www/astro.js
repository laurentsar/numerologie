/*
 * astro.js — signe astrologique (zodiaque tropical occidental).
 *
 * Calcul local a partir du jour/mois de naissance uniquement (pas d'heure ni
 * de lieu : ceci donne le signe solaire, pas un theme astral complet).
 * Aucune dependance, aucun appel reseau.
 *
 * Expose window.Astro = { signes, getSigne, compatibles }.
 */
(function () {
  'use strict';

  var signes = [
    {
      id: 'belier', nom: 'Belier', symbole: '♈', debut: [3, 21], fin: [4, 19],
      element: 'Feu', qualite: 'Cardinal', planete: 'Mars',
      motsCles: 'initiative, energie, impulsivite, audace',
      texte: "Vous avancez au premier instinct, sans trop attendre. L'energie est la, la patience moins : mieux vaut vous donner un terrain ou foncer plutot que trainer.",
      amour: "En amour, vous aimez la conquete et l'elan du debut ; le quotidien qui s'installe demande un effort d'entretien qui ne vous vient pas naturellement.",
      travail: "Au travail, vous excellez a demarrer et a trancher ; le suivi long et les taches repetitives vous coutent plus que le lancement lui-meme."
    },
    {
      id: 'taureau', nom: 'Taureau', symbole: '♉', debut: [4, 20], fin: [5, 20],
      element: 'Terre', qualite: 'Fixe', planete: 'Venus',
      motsCles: 'stabilite, sensualite, obstination, confort',
      texte: "Vous construisez lentement mais sur du solide, et vous n'aimez pas qu'on vous bouscule. Le changement passe mieux chez vous quand il arrive en douceur.",
      amour: "En amour, vous offrez une presence stable et sensorielle ; la jalousie ou la possessivite peuvent s'installer quand la securite du lien vous semble menacee.",
      travail: "Au travail, vous tenez la duree la ou d'autres abandonnent ; un changement impose sans preavis vous met en difficulte plus que la charge elle-meme."
    },
    {
      id: 'gemeaux', nom: 'Gemeaux', symbole: '♊', debut: [5, 21], fin: [6, 20],
      element: 'Air', qualite: 'Mutable', planete: 'Mercure',
      motsCles: 'curiosite, communication, dualite, agilite',
      texte: "Vous passez d'une idee a l'autre avec aisance, toujours en train d'apprendre ou de raconter quelque chose. Le risque : la dispersion quand trop de fronts s'ouvrent a la fois.",
      amour: "En amour, vous avez besoin d'un dialogue vivant et d'une vraie complicite intellectuelle ; la routine sans stimulation vous ennuie vite.",
      travail: "Au travail, vous etes a l'aise sur plusieurs sujets a la fois ; la concentration longue sur une seule tache demande un effort particulier."
    },
    {
      id: 'cancer', nom: 'Cancer', symbole: '♋', debut: [6, 21], fin: [7, 22],
      element: 'Eau', qualite: 'Cardinal', planete: 'Lune',
      motsCles: 'sensibilite, protection, memoire, foyer',
      texte: "Vous ressentez avant de comprendre, et vous protegez ce qui vous est cher avec force. Le foyer, au sens large, est votre point d'ancrage.",
      amour: "En amour, vous vous engagez profondement une fois la confiance etablie, mais la mefiance initiale peut retarder ce moment plus que necessaire.",
      travail: "Au travail, vous excellez a creer un climat de confiance dans une equipe ; la critique publique vous marque plus longtemps qu'elle n'y parait."
    },
    {
      id: 'lion', nom: 'Lion', symbole: '♌', debut: [7, 23], fin: [8, 22],
      element: 'Feu', qualite: 'Fixe', planete: 'Soleil',
      motsCles: 'rayonnement, fierte, generosite, confiance',
      texte: "Vous aimez exister pleinement et qu'on le remarque. Genereux quand on vous reconnait, plus difficile quand on vous ignore.",
      amour: "En amour, vous donnez avec generosite et attendez d'etre valorise en retour ; le manque de reconnaissance eteint vite votre elan.",
      travail: "Au travail, vous portez naturellement une equipe ou un projet ; deleguer sans lacher le controle reste un exercice a travailler."
    },
    {
      id: 'vierge', nom: 'Vierge', symbole: '♍', debut: [8, 23], fin: [9, 22],
      element: 'Terre', qualite: 'Mutable', planete: 'Mercure',
      motsCles: 'precision, service, analyse, discretion',
      texte: "Vous voyez le detail qui cloche et cherchez a bien faire, souvent en retrait. L'exigence tournee vers vous-meme peut devenir lourde si elle ne se relache jamais.",
      amour: "En amour, vous montrez votre attachement par des attentions concretes plutot que par de grandes declarations ; l'auto-critique peut vous freiner a vous livrer.",
      travail: "Au travail, la precision et la fiabilite sont vos points forts ; le perfectionnisme peut retarder ce qui serait deja suffisamment bon."
    },
    {
      id: 'balance', nom: 'Balance', symbole: '♎', debut: [9, 23], fin: [10, 22],
      element: 'Air', qualite: 'Cardinal', planete: 'Venus',
      motsCles: 'harmonie, diplomatie, esthetique, indecision',
      texte: "Vous cherchez l'equilibre et le lien, souvent au prix de vos propres preferences. Trancher seul reste le pas le plus difficile a franchir.",
      amour: "En amour, vous cherchez un vrai partenariat, equilibre et harmonieux ; eviter le conflit peut vous faire taire des besoins pourtant reels.",
      travail: "Au travail, vous etes precieux pour arbitrer et faire consensus ; les decisions solitaires et rapides restent un point d'effort."
    },
    {
      id: 'scorpion', nom: 'Scorpion', symbole: '♏', debut: [10, 23], fin: [11, 21],
      element: 'Eau', qualite: 'Fixe', planete: 'Pluton',
      motsCles: 'intensite, transformation, controle, loyaute',
      texte: "Vous vivez peu de choses a moitie : ce qui vous touche vous touche en profondeur. La confiance se gagne lentement, mais se garde longtemps.",
      amour: "En amour, vous vous engagez avec une intensite rare une fois la confiance accordee ; la trahison, reelle ou supposee, laisse une trace durable.",
      travail: "Au travail, vous menez les sujets sensibles ou strategiques avec efficacite ; partager le controle avec d'autres demande un effort conscient."
    },
    {
      id: 'sagittaire', nom: 'Sagittaire', symbole: '♐', debut: [11, 22], fin: [12, 21],
      element: 'Feu', qualite: 'Mutable', planete: 'Jupiter',
      motsCles: 'liberte, optimisme, horizons, franchise',
      texte: "Vous avez besoin d'espace et de sens : voyages, idees, grandes questions. L'engagement au quotidien demande un effort que l'aventure ne demande pas.",
      amour: "En amour, vous avez besoin d'un partenaire qui vous laisse de l'air ; la promesse d'exclusivite peut effrayer avant d'etre acceptee sereinement.",
      travail: "Au travail, vous portez loin une vision et motivez autour de vous ; les details administratifs vous interessent rarement autant que le projet lui-meme."
    },
    {
      id: 'capricorne', nom: 'Capricorne', symbole: '♑', debut: [12, 22], fin: [1, 19],
      element: 'Terre', qualite: 'Cardinal', planete: 'Saturne',
      motsCles: 'discipline, ambition, patience, responsabilite',
      texte: "Vous avancez par etapes vers un but tenu sur la duree, sans compter les efforts. Le relachement et le plaisir gratuit ne viennent pas naturellement.",
      amour: "En amour, vous vous engagez avec serieux et sur la duree, meme si l'expression des sentiments vient moins facilement que les actes.",
      travail: "Au travail, votre endurance et votre sens des responsabilites sont reconnus tot ; savoir s'arreter et celebrer une reussite reste plus difficile."
    },
    {
      id: 'verseau', nom: 'Verseau', symbole: '♒', debut: [1, 20], fin: [2, 18],
      element: 'Air', qualite: 'Fixe', planete: 'Uranus',
      motsCles: 'independance, originalite, collectif, detachement',
      texte: "Vous pensez souvent a cote du cadre etabli et tenez a votre liberte de jugement. Le lien passe mieux par les idees partagees que par la proximite immediate.",
      amour: "En amour, vous avez besoin d'un lien fonde sur le respect de l'independance de chacun ; la fusion permanente vous etouffe plus qu'elle ne vous rassure.",
      travail: "Au travail, vous apportez des idees originales que d'autres n'auraient pas eues ; un cadre trop rigide use votre motivation plus vite qu'ailleurs."
    },
    {
      id: 'poissons', nom: 'Poissons', symbole: '♓', debut: [2, 19], fin: [3, 20],
      element: 'Eau', qualite: 'Mutable', planete: 'Neptune',
      motsCles: 'intuition, empathie, imaginaire, fuite',
      texte: "Vous absorbez ce qui vous entoure, parfois au point de vous y perdre. L'imaginaire est une vraie ressource tant qu'il ne remplace pas l'action.",
      amour: "En amour, vous vous donnez avec une empathie rare et ressentez ce que l'autre traverse sans qu'il ait besoin de le dire ; poser des limites claires reste votre point de vigilance.",
      travail: "Au travail, votre intuition et votre creativite sont des atouts reels ; un cadre trop flou peut vous laisser sans direction concrete."
    }
  ];

  function dansIntervalle(mois, jour, debut, fin) {
    if (debut[0] === fin[0]) return mois === debut[0] && jour >= debut[1] && jour <= fin[1];
    // la periode traverse le changement d'annee (capricorne : 22 dec -> 19 jan)
    return (mois === debut[0] && jour >= debut[1]) || (mois === fin[0] && jour <= fin[1]);
  }

  function getSigne(jour, mois) {
    for (var i = 0; i < signes.length; i++) {
      if (dansIntervalle(mois, jour, signes[i].debut, signes[i].fin)) return signes[i];
    }
    return null;
  }

  var complements = { Feu: 'Air', Air: 'Feu', Terre: 'Eau', Eau: 'Terre' };

  function compatibles(signe) {
    if (!signe) return [];
    var proche = complements[signe.element];
    return signes.filter(function (s) {
      return s.id !== signe.id && (s.element === signe.element || s.element === proche);
    }).map(function (s) { return s.nom; });
  }

  window.Astro = { signes: signes, getSigne: getSigne, compatibles: compatibles };
})();
