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
      texte: "Vous avancez au premier instinct, sans trop attendre. L'energie est la, la patience moins : mieux vaut vous donner un terrain ou foncer plutot que trainer."
    },
    {
      id: 'taureau', nom: 'Taureau', symbole: '♉', debut: [4, 20], fin: [5, 20],
      element: 'Terre', qualite: 'Fixe', planete: 'Venus',
      motsCles: 'stabilite, sensualite, obstination, confort',
      texte: "Vous construisez lentement mais sur du solide, et vous n'aimez pas qu'on vous bouscule. Le changement passe mieux chez vous quand il arrive en douceur."
    },
    {
      id: 'gemeaux', nom: 'Gemeaux', symbole: '♊', debut: [5, 21], fin: [6, 20],
      element: 'Air', qualite: 'Mutable', planete: 'Mercure',
      motsCles: 'curiosite, communication, dualite, agilite',
      texte: "Vous passez d'une idee a l'autre avec aisance, toujours en train d'apprendre ou de raconter quelque chose. Le risque : la dispersion quand trop de fronts s'ouvrent a la fois."
    },
    {
      id: 'cancer', nom: 'Cancer', symbole: '♋', debut: [6, 21], fin: [7, 22],
      element: 'Eau', qualite: 'Cardinal', planete: 'Lune',
      motsCles: 'sensibilite, protection, memoire, foyer',
      texte: "Vous ressentez avant de comprendre, et vous protegez ce qui vous est cher avec force. Le foyer, au sens large, est votre point d'ancrage."
    },
    {
      id: 'lion', nom: 'Lion', symbole: '♌', debut: [7, 23], fin: [8, 22],
      element: 'Feu', qualite: 'Fixe', planete: 'Soleil',
      motsCles: 'rayonnement, fierte, generosite, confiance',
      texte: "Vous aimez exister pleinement et qu'on le remarque. Genereux quand on vous reconnait, plus difficile quand on vous ignore."
    },
    {
      id: 'vierge', nom: 'Vierge', symbole: '♍', debut: [8, 23], fin: [9, 22],
      element: 'Terre', qualite: 'Mutable', planete: 'Mercure',
      motsCles: 'precision, service, analyse, discretion',
      texte: "Vous voyez le detail qui cloche et cherchez a bien faire, souvent en retrait. L'exigence tournee vers vous-meme peut devenir lourde si elle ne se relache jamais."
    },
    {
      id: 'balance', nom: 'Balance', symbole: '♎', debut: [9, 23], fin: [10, 22],
      element: 'Air', qualite: 'Cardinal', planete: 'Venus',
      motsCles: 'harmonie, diplomatie, esthetique, indecision',
      texte: "Vous cherchez l'equilibre et le lien, souvent au prix de vos propres preferences. Trancher seul reste le pas le plus difficile a franchir."
    },
    {
      id: 'scorpion', nom: 'Scorpion', symbole: '♏', debut: [10, 23], fin: [11, 21],
      element: 'Eau', qualite: 'Fixe', planete: 'Pluton',
      motsCles: 'intensite, transformation, controle, loyaute',
      texte: "Vous vivez peu de choses a moitie : ce qui vous touche vous touche en profondeur. La confiance se gagne lentement, mais se garde longtemps."
    },
    {
      id: 'sagittaire', nom: 'Sagittaire', symbole: '♐', debut: [11, 22], fin: [12, 21],
      element: 'Feu', qualite: 'Mutable', planete: 'Jupiter',
      motsCles: 'liberte, optimisme, horizons, franchise',
      texte: "Vous avez besoin d'espace et de sens : voyages, idees, grandes questions. L'engagement au quotidien demande un effort que l'aventure ne demande pas."
    },
    {
      id: 'capricorne', nom: 'Capricorne', symbole: '♑', debut: [12, 22], fin: [1, 19],
      element: 'Terre', qualite: 'Cardinal', planete: 'Saturne',
      motsCles: 'discipline, ambition, patience, responsabilite',
      texte: "Vous avancez par etapes vers un but tenu sur la duree, sans compter les efforts. Le relachement et le plaisir gratuit ne viennent pas naturellement."
    },
    {
      id: 'verseau', nom: 'Verseau', symbole: '♒', debut: [1, 20], fin: [2, 18],
      element: 'Air', qualite: 'Fixe', planete: 'Uranus',
      motsCles: 'independance, originalite, collectif, detachement',
      texte: "Vous pensez souvent a cote du cadre etabli et tenez a votre liberte de jugement. Le lien passe mieux par les idees partagees que par la proximite immediate."
    },
    {
      id: 'poissons', nom: 'Poissons', symbole: '♓', debut: [2, 19], fin: [3, 20],
      element: 'Eau', qualite: 'Mutable', planete: 'Neptune',
      motsCles: 'intuition, empathie, imaginaire, fuite',
      texte: "Vous absorbez ce qui vous entoure, parfois au point de vous y perdre. L'imaginaire est une vraie ressource tant qu'il ne remplace pas l'action."
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
