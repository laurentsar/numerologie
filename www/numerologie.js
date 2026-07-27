/*
 * numerologie.js — moteur de calcul.
 *
 * Numerologie occidentale pythagoricienne, tradition francaise (celle exposee
 * dans « Le Guide de la Numerologie » de Jean-Daniel Fermier). Ce fichier ne
 * contient QUE des calculs : aucun texte d'interpretation (voir
 * interpretations.js, editable sans toucher au moteur).
 *
 * Aucune dependance. Expose window.Numero.
 */
(function () {
  'use strict';

  // --- Table pythagoricienne : A=1..I=9, J=1..R=9, S=1..Z=8 -----------------
  var VALEURS = {
    A: 1, J: 1, S: 1,
    B: 2, K: 2, T: 2,
    C: 3, L: 3, U: 3,
    D: 4, M: 4, V: 4,
    E: 5, N: 5, W: 5,
    F: 6, O: 6, X: 6,
    G: 7, P: 7, Y: 7,
    H: 8, Q: 8, Z: 8,
    I: 9, R: 9
  };

  var MAITRES = [11, 22, 33];
  var VOYELLES = 'AEIOU';

  /* Normalise : majuscules, accents retires, ne garde que A-Z et les
     separateurs de mots. « Jean-Pierre Éloi » -> « JEAN PIERRE ELOI ». */
  function normaliser(s) {
    return String(s || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z\s'-]/g, ' ')
      .replace(/[\s'-]+/g, ' ')
      .trim();
  }

  /* Reduction theosophique : additionne les chiffres jusqu'a 1..9.
     Les nombres maitres 11, 22 et 33 sont conserves (sauf si gardeMaitres
     vaut false, cas des defis ou 0 est une valeur legitime). */
  function reduire(n, gardeMaitres) {
    if (gardeMaitres === undefined) gardeMaitres = true;
    n = Math.abs(parseInt(n, 10) || 0);
    while (n > 9) {
      if (gardeMaitres && MAITRES.indexOf(n) !== -1) return n;
      var s = 0, m = n;
      while (m > 0) { s += m % 10; m = Math.floor(m / 10); }
      n = s;
    }
    return n;
  }

  /* Le Y est une voyelle quand il joue ce role : entoure de consonnes ou de
     bornes de mot. Colle a une autre voyelle (« Guy », « Maya »), il est traite
     comme consonne. Regle classique de la numerologie francaise. */
  function estVoyelle(mot, i) {
    var c = mot[i];
    if (VOYELLES.indexOf(c) !== -1) return true;
    if (c !== 'Y') return false;
    var avant = i > 0 ? mot[i - 1] : '';
    var apres = i < mot.length - 1 ? mot[i + 1] : '';
    var voyAvant = avant && VOYELLES.indexOf(avant) !== -1;
    var voyApres = apres && VOYELLES.indexOf(apres) !== -1;
    return !voyAvant && !voyApres;
  }

  /* Decoupe un nom en lettres annotees {lettre, valeur, voyelle}. */
  function lettres(nom) {
    var out = [];
    normaliser(nom).split(' ').forEach(function (mot) {
      for (var i = 0; i < mot.length; i++) {
        var c = mot[i];
        if (!VALEURS[c]) continue;
        out.push({ lettre: c, valeur: VALEURS[c], voyelle: estVoyelle(mot, i) });
      }
    });
    return out;
  }

  function somme(tab) {
    return tab.reduce(function (a, l) { return a + l.valeur; }, 0);
  }

  // --- Nombres issus du nom -------------------------------------------------

  function nombreExpression(prenoms, nom) {
    return reduire(somme(lettres(prenoms + ' ' + nom)));
  }

  function nombreIntime(prenoms, nom) {
    return reduire(somme(lettres(prenoms + ' ' + nom).filter(function (l) { return l.voyelle; })));
  }

  function nombreRealisation(prenoms, nom) {
    return reduire(somme(lettres(prenoms + ' ' + nom).filter(function (l) { return !l.voyelle; })));
  }

  function nombreActif(prenoms) {
    return reduire(somme(lettres(prenoms)));
  }

  function nombreHereditaire(nom) {
    return reduire(somme(lettres(nom)));
  }

  /* Nombre d'equilibre : initiales de chaque mot du nom complet. */
  function nombreEquilibre(prenoms, nom) {
    var total = 0;
    normaliser(prenoms + ' ' + nom).split(' ').forEach(function (mot) {
      if (mot && VALEURS[mot[0]]) total += VALEURS[mot[0]];
    });
    return reduire(total);
  }

  // --- Nombres issus de la date de naissance --------------------------------

  /* Parse « AAAA-MM-JJ » (valeur d'un <input type=date>). */
  function parseDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    if (!m) return null;
    var a = +m[1], mo = +m[2], j = +m[3];
    var d = new Date(Date.UTC(a, mo - 1, j));
    if (d.getUTCFullYear() !== a || d.getUTCMonth() !== mo - 1 || d.getUTCDate() !== j) return null;
    return { jour: j, mois: mo, annee: a };
  }

  /* Chemin de vie : on reduit separement jour, mois et annee, puis on additionne
     et on reduit. C'est la methode retenue par la tradition francaise ; elle
     preserve les nombres maitres de chaque composante. */
  function cheminDeVie(d) {
    return reduire(reduire(d.jour) + reduire(d.mois) + reduire(d.annee));
  }

  function nombreDuJour(d) {
    return reduire(d.jour);
  }

  // --- Cycles temporels -----------------------------------------------------

  function anneePersonnelle(d, annee) {
    return reduire(reduire(d.jour) + reduire(d.mois) + reduire(annee));
  }

  function moisPersonnel(d, annee, mois) {
    return reduire(anneePersonnelle(d, annee) + reduire(mois));
  }

  function jourPersonnel(d, annee, mois, jour) {
    return reduire(moisPersonnel(d, annee, mois) + reduire(jour));
  }

  /* Age de bascule du premier cycle : 36 - chemin de vie, ramene dans 27..35. */
  function premiereBascule(cdv) {
    var age = 36 - reduire(cdv);
    while (age < 27) age += 9;
    while (age > 35) age -= 9;
    return age;
  }

  /* Trois cycles de vie : formatif (mois), productif (jour), moisson (annee). */
  function cyclesDeVie(d) {
    var b = premiereBascule(cheminDeVie(d));
    return [
      { nom: 'Cycle formatif', nombre: reduire(d.mois), de: 0, a: b },
      { nom: 'Cycle productif', nombre: reduire(d.jour), de: b + 1, a: b + 27 },
      { nom: 'Cycle de moisson', nombre: reduire(d.annee), de: b + 28, a: null }
    ];
  }

  /* Quatre realisations (pinacles), de 9 ans chacune apres la premiere. */
  function realisations(d) {
    var b = premiereBascule(cheminDeVie(d));
    var r1 = reduire(reduire(d.jour) + reduire(d.mois));
    var r2 = reduire(reduire(d.jour) + reduire(d.annee));
    var r3 = reduire(r1 + r2);
    var r4 = reduire(reduire(d.mois) + reduire(d.annee));
    return [
      { nom: '1re realisation', nombre: r1, de: 0, a: b },
      { nom: '2e realisation', nombre: r2, de: b + 1, a: b + 9 },
      { nom: '3e realisation', nombre: r3, de: b + 10, a: b + 18 },
      { nom: '4e realisation', nombre: r4, de: b + 19, a: null }
    ];
  }

  /* Defis : ecarts absolus. Pas de nombre maitre ici, et 0 est une valeur
     pleine et entiere (defi « zero » = aucun obstacle impose, tout est libre). */
  function defis(d) {
    var j = reduire(d.jour, false), m = reduire(d.mois, false), a = reduire(d.annee, false);
    var d1 = Math.abs(j - m);
    var d2 = Math.abs(j - a);
    var d3 = Math.abs(d1 - d2);
    var d4 = Math.abs(m - a);
    var b = premiereBascule(cheminDeVie(d));
    return [
      { nom: '1er defi', nombre: d1, de: 0, a: b },
      { nom: '2e defi', nombre: d2, de: b + 1, a: b + 9 },
      { nom: 'Defi majeur', nombre: d3, de: 0, a: null },
      { nom: '4e defi', nombre: d4, de: b + 19, a: null }
    ];
  }

  // --- Grille d'inclusion ---------------------------------------------------

  /* Compte combien de fois chaque valeur 1..9 apparait dans le nom complet.
     Les absences sont les « lacunes » (lecons a apprendre), les surnombres les
     dominantes. La reference de frequence sert a juger sur/sous-representation
     pour un nom francais de longueur courante. */
  var FREQUENCE_ATTENDUE = { 1: 3, 2: 1, 3: 2, 4: 1, 5: 3, 6: 1, 7: 1, 8: 1, 9: 2 };

  function grilleInclusion(prenoms, nom) {
    var compte = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    lettres(prenoms + ' ' + nom).forEach(function (l) { compte[l.valeur]++; });
    var lacunes = [], dominantes = [];
    for (var v = 1; v <= 9; v++) {
      if (compte[v] === 0) lacunes.push(v);
      else if (compte[v] >= FREQUENCE_ATTENDUE[v] + 2) dominantes.push(v);
    }
    return { compte: compte, lacunes: lacunes, dominantes: dominantes };
  }

  // --- Theme complet --------------------------------------------------------

  function theme(prenoms, nom, dateISO, aujourdhui) {
    var d = parseDate(dateISO);
    if (!d) return null;
    var now = aujourdhui || new Date();
    var an = now.getFullYear(), mo = now.getMonth() + 1, jo = now.getDate();

    var cdv = cheminDeVie(d);
    return {
      etatCivil: { prenoms: prenoms, nom: nom, date: d },
      cheminDeVie: cdv,
      expression: nombreExpression(prenoms, nom),
      intime: nombreIntime(prenoms, nom),
      realisation: nombreRealisation(prenoms, nom),
      actif: nombreActif(prenoms),
      hereditaire: nombreHereditaire(nom),
      equilibre: nombreEquilibre(prenoms, nom),
      jourNaissance: nombreDuJour(d),
      anneePersonnelle: anneePersonnelle(d, an),
      moisPersonnel: moisPersonnel(d, an, mo),
      jourPersonnel: jourPersonnel(d, an, mo, jo),
      cycles: cyclesDeVie(d),
      realisations: realisations(d),
      defis: defis(d),
      grille: grilleInclusion(prenoms, nom),
      lettres: lettres(prenoms + ' ' + nom),
      age: ageAu(d, now)
    };
  }

  function ageAu(d, now) {
    var age = now.getFullYear() - d.annee;
    var m = (now.getMonth() + 1) - d.mois;
    if (m < 0 || (m === 0 && now.getDate() < d.jour)) age--;
    return age;
  }

  // --- Accord entre deux themes ---------------------------------------------

  /* Affinites entre chemins de vie. Volontairement grossier : trois niveaux,
     pas de score a la decimale qui donnerait une fausse impression de precision.
     Base sur les familles traditionnelles :
       actifs/meneurs 1-8-9 | sensibles/relationnels 2-6-3 | structurants 4-7-22
       libres 5-3 | maitres 11-22-33 amplifient le nombre reduit correspondant. */
  var FAMILLES = {
    1: 'action', 8: 'action', 9: 'action',
    2: 'relation', 6: 'relation', 3: 'relation',
    4: 'structure', 7: 'structure',
    5: 'liberte',
    11: 'relation', 22: 'structure', 33: 'relation'
  };
  var AFFINITE = {
    'action|action': 2, 'relation|relation': 3, 'structure|structure': 3,
    'liberte|liberte': 2,
    'action|relation': 2, 'action|structure': 1, 'action|liberte': 2,
    'relation|structure': 2, 'relation|liberte': 1,
    'structure|liberte': 1
  };

  function accord(a, b) {
    function niveau(x, y) {
      var fa = FAMILLES[x] || 'action', fb = FAMILLES[y] || 'action';
      var cle = [fa, fb].sort().join('|');
      return AFFINITE[cle] !== undefined ? AFFINITE[cle] : 2;
    }
    var nCdv = niveau(a.cheminDeVie, b.cheminDeVie);
    var nExp = niveau(a.expression, b.expression);
    var nInt = niveau(a.intime, b.intime);
    var total = nCdv * 2 + nExp + nInt; // le chemin de vie pese double
    var max = 3 * 4;
    return {
      cheminDeVie: nCdv, expression: nExp, intime: nInt,
      niveau: total >= max - 2 ? 'fluide' : (total >= max - 5 ? 'nuance' : 'exigeant'),
      identiques: a.cheminDeVie === b.cheminDeVie
    };
  }

  window.Numero = {
    VALEURS: VALEURS,
    MAITRES: MAITRES,
    normaliser: normaliser,
    reduire: reduire,
    lettres: lettres,
    parseDate: parseDate,
    theme: theme,
    accord: accord,
    anneePersonnelle: anneePersonnelle,
    moisPersonnel: moisPersonnel,
    jourPersonnel: jourPersonnel
  };
})();
