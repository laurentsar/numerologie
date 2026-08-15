/*
 * app.js — interface. Ne calcule rien : delegue a window.Numero (numerologie.js)
 * et lit les textes dans window.Interpretations (interpretations.js).
 * Stockage local uniquement (localStorage), aucune donnee ne sort du telephone.
 */
(function () {
  'use strict';

  var N = window.Numero, I = window.Interpretations, T = window.Tarot, A = window.Astro;
  var KEY = 'numeroProfils';
  var KEY_ACTIF = 'numeroProfilActif';
  var KEY_TIRAGES = 'numeroTirages';
  var MAX_HISTORIQUE = 30;

  var profils = [];
  var themeCourant = null;
  var historiqueTirages = [];

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  function lsGet(k, d) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }
    catch (e) { return d; }
  }
  function lsSet(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* quota */ }
  }

  // ----------------------------- écrans -------------------------------------
  function showScreen(nom) {
    document.querySelectorAll('.screen').forEach(function (s) {
      s.classList.toggle('active', s.id === 'screen-' + nom);
    });
    window.scrollTo(0, 0);
  }

  function initEcrans() {
    document.querySelectorAll('.theme-card').forEach(function (b) {
      b.addEventListener('click', function () { showScreen(b.dataset.screen); });
    });
    document.querySelectorAll('[data-back]').forEach(function (b) {
      b.addEventListener('click', function () { showScreen('home'); });
    });
    $('infosBtn').addEventListener('click', function () { showScreen('infos'); });
  }

  // ----------------------------- onglets -----------------------------------
  function initTabs() {
    document.querySelectorAll('.tab').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.tab').forEach(function (x) { x.classList.remove('active'); });
        document.querySelectorAll('.tab-panel').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        $('tab-' + b.dataset.tab).classList.add('active');
        window.scrollTo(0, 0);
      });
    });
  }

  // ----------------------------- profils -----------------------------------
  function chargerProfils() {
    profils = lsGet(KEY, []);
    rendreChips();
    remplirSelects();
  }

  function rendreChips() {
    var box = $('profilChips');
    if (!profils.length) { box.innerHTML = ''; return; }
    var actif = lsGet(KEY_ACTIF, null);
    box.innerHTML = profils.map(function (p, i) {
      return '<span class="chip' + (p.id === actif ? ' active' : '') + '" data-i="' + i + '">' +
        esc(p.prenoms.split(' ')[0] + ' ' + p.nom) +
        ' <b class="x" data-del="' + i + '">×</b></span>';
    }).join('');
    box.querySelectorAll('.chip').forEach(function (c) {
      c.addEventListener('click', function (e) {
        var i = +c.dataset.i;
        if (e.target.dataset.del !== undefined) {
          if (!confirm('Supprimer ce thème ?')) return;
          profils.splice(i, 1); lsSet(KEY, profils);
          chargerProfils(); return;
        }
        var p = profils[i];
        $('inPrenoms').value = p.prenoms;
        $('inNom').value = p.nom;
        $('inDate').value = p.date;
        lsSet(KEY_ACTIF, p.id);
        calculer();
      });
    });
  }

  function enregistrer() {
    var prenoms = $('inPrenoms').value.trim();
    var nom = $('inNom').value.trim();
    var date = $('inDate').value;
    if (!prenoms || !nom || !N.parseDate(date)) { alert('Renseigne prénom, nom et date de naissance.'); return; }
    var id = (prenoms + '|' + nom + '|' + date).toLowerCase();
    var existe = profils.some(function (p) { return p.id === id; });
    if (!existe) { profils.push({ id: id, prenoms: prenoms, nom: nom, date: date }); lsSet(KEY, profils); }
    lsSet(KEY_ACTIF, id);
    chargerProfils();
  }

  function remplirSelects() {
    ['accordA', 'accordB'].forEach(function (sid) {
      var s = $(sid);
      if (!s) return;
      var prev = s.value;
      s.innerHTML = profils.map(function (p, i) {
        return '<option value="' + i + '">' + esc(p.prenoms.split(' ')[0] + ' ' + p.nom) + '</option>';
      }).join('');
      if (prev && s.querySelector('option[value="' + prev + '"]')) s.value = prev;
    });
  }

  // ----------------------------- rendu thème -------------------------------
  function badge(n) {
    var m = N.MAITRES.indexOf(n) !== -1;
    return '<div class="num-badge' + (m ? ' maitre' : '') + '">' + n + '</div>';
  }

  function carteNombre(nom, n, table) {
    return '<div class="num-card">' + badge(n) +
      '<div class="num-body">' +
        '<div class="num-name">' + esc(nom) + ' — ' + esc(I.titres[n] || '') + '</div>' +
        '<div class="num-sub">' + esc(I.motsCles[n] || '') + '</div>' +
        '<div class="num-txt">' + esc(I.get(table, n)) + '</div>' +
      '</div></div>';
  }

  function calculer() {
    var prenoms = $('inPrenoms').value.trim();
    var nom = $('inNom').value.trim();
    var date = $('inDate').value;
    if (!prenoms || !nom) { alert('Renseigne les prénoms et le nom de naissance.'); return; }
    if (!N.parseDate(date)) { alert('Date de naissance invalide.'); return; }

    var t = N.theme(prenoms, nom, date);
    themeCourant = t;

    // --- héros : chemin de vie
    $('heroNum').textContent = t.cheminDeVie;
    $('heroTitre').textContent = I.titres[t.cheminDeVie] || '';
    $('heroCles').textContent = I.motsCles[t.cheminDeVie] || '';
    $('heroTexte').textContent = I.get('cheminDeVie', t.cheminDeVie);

    // --- nombres du nom
    $('nombresNom').innerHTML =
      carteNombre("Nombre d'expression", t.expression, 'expression') +
      carteNombre('Nombre intime', t.intime, 'intime') +
      carteNombre('Nombre de réalisation', t.realisation, 'realisation') +
      '<div class="num-card">' + badge(t.actif) +
        '<div class="num-body"><div class="num-name">Nombre actif — ' + esc(I.titres[t.actif] || '') + '</div>' +
        '<div class="num-sub">prénom(s) seuls</div>' +
        '<div class="num-txt">' + esc(I.get('actif', t.actif)) + '</div></div></div>' +
      '<div class="num-card">' + badge(t.hereditaire) +
        '<div class="num-body"><div class="num-name">Nombre héréditaire — ' + esc(I.titres[t.hereditaire] || '') + '</div>' +
        '<div class="num-sub">nom de famille seul</div>' +
        '<div class="num-txt">' + esc(I.get('hereditaire', t.hereditaire)) + '</div></div></div>' +
      '<div class="num-card">' + badge(t.equilibre) +
        '<div class="num-body"><div class="num-name">Nombre d\'équilibre — ' + esc(I.titres[t.equilibre] || '') + '</div>' +
        '<div class="num-sub">initiales</div>' +
        '<div class="num-txt">' + esc(I.get('equilibre', t.equilibre)) + '</div></div></div>' +
      '<div class="num-card">' + badge(t.jourNaissance) +
        '<div class="num-body"><div class="num-name">Jour de naissance — ' + esc(I.titres[t.jourNaissance] || '') + '</div>' +
        '<div class="num-sub">jour ' + t.etatCivil.date.jour + '</div>' +
        '<div class="num-txt">' + esc(I.get('talent', t.jourNaissance)) + '</div></div></div>';

    // --- aujourd'hui
    $('nombresJour').innerHTML =
      carteNombre('Année personnelle', t.anneePersonnelle, 'anneePersonnelle') +
      '<div class="num-card">' + badge(t.moisPersonnel) +
        '<div class="num-body"><div class="num-name">Mois personnel</div>' +
        '<div class="num-txt">' + esc(I.get('essence', t.moisPersonnel)) + '</div></div></div>' +
      '<div class="num-card">' + badge(t.jourPersonnel) +
        '<div class="num-body"><div class="num-name">Jour personnel</div>' +
        '<div class="num-txt">' + esc(I.get('essence', t.jourPersonnel)) + '</div></div></div>';

    $('themeOut').classList.remove('hidden');
    rendreCycles(t);
    rendreGrille(t);
    rendreAstro(t);
  }

  // ----------------------------- cycles ------------------------------------
  function periode(p, age, table) {
    var actif = age >= p.de && (p.a === null || age <= p.a);
    var bornes = p.a === null ? ('à partir de ' + p.de + ' ans')
      : (p.de === 0 ? 'de la naissance à ' + p.a + ' ans' : 'de ' + p.de + ' à ' + p.a + ' ans');
    return '<div class="periode' + (actif ? ' now' : '') + '">' +
      '<div class="per-num">' + p.nombre + '</div>' +
      '<div><div class="per-head">' + esc(p.nom) +
        (actif ? '<span class="now-tag">en cours</span>' : '') + '</div>' +
      '<div class="per-age">' + bornes + '</div>' +
      '<div class="per-txt">' + esc(I.get(table, p.nombre)) + '</div></div></div>';
  }

  function rendreCycles(t) {
    $('cyclesEmpty').classList.add('hidden');
    $('cyclesOut').classList.remove('hidden');
    var age = t.age;

    $('anneeCard').innerHTML =
      '<div class="num-card">' + badge(t.anneePersonnelle) +
      '<div class="num-body"><div class="num-name">Année ' + new Date().getFullYear() + '</div>' +
      '<div class="num-txt">' + esc(I.get('anneePersonnelle', t.anneePersonnelle)) + '</div></div></div>';

    $('cyclesList').innerHTML = t.cycles.map(function (p) { return periode(p, age, 'essence'); }).join('');
    $('realisList').innerHTML = t.realisations.map(function (p) { return periode(p, age, 'essence'); }).join('');
    $('defisList').innerHTML = t.defis.map(function (p) { return periode(p, age, 'defis'); }).join('');
  }

  // ----------------------------- grille ------------------------------------
  function rendreGrille(t) {
    $('grilleEmpty').classList.add('hidden');
    $('grilleOut').classList.remove('hidden');
    var g = t.grille;

    var cells = '';
    for (var v = 1; v <= 9; v++) {
      var c = g.compte[v];
      var cls = c === 0 ? ' vide' : (g.dominantes.indexOf(v) !== -1 ? ' dom' : '');
      cells += '<div class="gcell' + cls + '"><div class="gn">' + v + '</div>' +
        '<div class="gc">' + (c === 0 ? 'absent' : c + '×') + '</div></div>';
    }
    $('grilleTable').innerHTML = cells;

    var txt = '';
    if (g.lacunes.length) {
      txt += '<h2>Lacunes</h2>' + g.lacunes.map(function (v) {
        return '<div class="num-card">' + badge(v) + '<div class="num-body"><div class="num-txt">' +
          esc(I.get('lacunes', v)) + '</div></div></div>';
      }).join('');
    }
    if (g.dominantes.length) {
      txt += '<h2>Dominantes</h2>' + g.dominantes.map(function (v) {
        return '<div class="num-card">' + badge(v) + '<div class="num-body"><div class="num-txt">' +
          esc(I.get('dominantes', v)) + '</div></div></div>';
      }).join('');
    }
    if (!txt) txt = '<p class="muted">Aucune lacune ni dominante marquée : une répartition équilibrée.</p>';
    $('grilleTextes').innerHTML = txt;

    $('lettresOut').innerHTML = t.lettres.map(function (l) {
      return '<div class="lt' + (l.voyelle ? ' voy' : '') + '"><b>' + l.lettre + '</b><span>' + l.valeur + '</span></div>';
    }).join('');
  }

  // ------------------------------ astro -------------------------------------
  function rendreAstro(t) {
    var d = t.etatCivil.date;
    var s = A.getSigne(d.jour, d.mois);
    if (!s) return;

    $('astroEmpty').classList.add('hidden');
    $('astroOut').classList.remove('hidden');

    $('astroSymbole').textContent = s.symbole;
    $('astroNom').textContent = s.nom;
    $('astroCles').textContent = s.motsCles;
    $('astroTexte').textContent = s.texte;

    $('astroDetail').innerHTML =
      '<div class="num-card"><div class="num-badge">' + s.symbole + '</div>' +
        '<div class="num-body"><div class="num-name">Élément</div>' +
        '<div class="num-txt">' + esc(s.element) + '</div></div></div>' +
      '<div class="num-card"><div class="num-badge">' + s.symbole + '</div>' +
        '<div class="num-body"><div class="num-name">Qualité</div>' +
        '<div class="num-txt">' + esc(s.qualite) + '</div></div></div>' +
      '<div class="num-card"><div class="num-badge">' + s.symbole + '</div>' +
        '<div class="num-body"><div class="num-name">Planète maîtresse</div>' +
        '<div class="num-txt">' + esc(s.planete) + '</div></div></div>' +
      '<div class="num-card"><div class="num-badge">' + s.symbole + '</div>' +
        '<div class="num-body"><div class="num-name">En amour</div>' +
        '<div class="num-txt">' + esc(s.amour) + '</div></div></div>' +
      '<div class="num-card"><div class="num-badge">' + s.symbole + '</div>' +
        '<div class="num-body"><div class="num-name">Au travail</div>' +
        '<div class="num-txt">' + esc(s.travail) + '</div></div></div>';

    $('astroCompat').textContent = A.compatibles(s).join(' · ');
  }

  // ----------------------------- accord ------------------------------------
  function comparer() {
    var ia = +$('accordA').value, ib = +$('accordB').value;
    var pa = profils[ia], pb = profils[ib];
    if (!pa || !pb) { alert('Enregistre au moins deux thèmes.'); return; }
    if (ia === ib) { alert('Choisis deux personnes différentes.'); return; }

    var ta = N.theme(pa.prenoms, pa.nom, pa.date);
    var tb = N.theme(pb.prenoms, pb.nom, pb.date);
    var a = N.accord(ta, tb);

    var libelle = { fluide: 'Accord fluide', nuance: 'Accord nuancé', exigeant: 'Accord exigeant' }[a.niveau];
    var commentaire = {
      fluide: "Vos rythmes se ressemblent. Le risque n'est pas le conflit mais la routine : personne ne pousse l'autre hors de sa zone.",
      nuance: "Des appuis communs et de vraies différences. C'est souvent la configuration la plus vivante, à condition d'expliciter les attentes.",
      exigeant: "Vos façons d'avancer divergent nettement. Rien de rédhibitoire, mais l'entente se construit consciemment plutôt qu'elle ne coule de source."
    }[a.niveau];

    function ligne(nom, na, nb) {
      return '<div class="num-card"><div class="num-body"><div class="num-name">' + esc(nom) + '</div>' +
        '<div class="num-txt">' + esc(pa.prenoms.split(' ')[0]) + ' : <b>' + na + '</b> (' + esc(I.titres[na] || '') + ')' +
        ' &nbsp;·&nbsp; ' + esc(pb.prenoms.split(' ')[0]) + ' : <b>' + nb + '</b> (' + esc(I.titres[nb] || '') + ')' +
        '</div></div></div>';
    }

    $('accordOut').innerHTML =
      '<div class="accord-box"><div class="accord-niv niv-' + a.niveau + '">' + libelle + '</div>' +
      '<p class="muted">' + esc(commentaire) + '</p>' +
      (a.identiques ? '<p class="muted">Chemins de vie identiques : compréhension immédiate, et les mêmes angles morts chez les deux.</p>' : '') +
      '</div>' +
      ligne('Chemin de vie', ta.cheminDeVie, tb.cheminDeVie) +
      ligne("Nombre d'expression", ta.expression, tb.expression) +
      ligne('Nombre intime', ta.intime, tb.intime);
  }

  // ----------------------------- tirage -------------------------------------
  function initTirage() {
    var s = $('tirageSpread');
    s.innerHTML = T.spreads.map(function (sp) {
      return '<option value="' + sp.id + '">' + esc(sp.nom) + ' (' + sp.positions.length + ' cartes)</option>';
    }).join('');
    s.addEventListener('change', majDescTirage);
    majDescTirage();
  }

  function majDescTirage() {
    var sp = T.spreads.filter(function (x) { return x.id === $('tirageSpread').value; })[0];
    $('tirageDesc').textContent = sp ? sp.positions.join(' · ') : '';
  }

  function tirerCartes() {
    var res = T.tirer($('tirageSpread').value);
    if (!res) return;
    $('tirageOut').innerHTML = res.tirage.map(function (t, i) {
      return '<div class="periode carte-sortie" style="animation-delay:' + (i * 140) + 'ms">' +
        '<div class="per-num">' + (i + 1) + '</div>' +
        '<div><div class="per-head">' + esc(t.position) + '</div>' +
        '<div class="per-age">' + esc(t.carte.nom) + ' — ' + esc(t.carte.famille) + '</div>' +
        '<div class="num-sub">' + esc(t.carte.motsCles) + '</div>' +
        '<div class="per-txt">' + esc(t.carte.texte) + '</div></div></div>';
    }).join('');
    window.scrollTo(0, 0);
    sauverTirage(res);
  }

  // ------------------------- historique des tirages -------------------------
  function chargerHistoriqueTirages() {
    historiqueTirages = lsGet(KEY_TIRAGES, []);
    rendreHistoriqueTirages();
  }

  function sauverTirage(res) {
    historiqueTirages.unshift({
      date: new Date().toISOString(),
      spread: res.spread.nom,
      cartes: res.tirage.map(function (t) {
        return { position: t.position, nom: t.carte.nom, famille: t.carte.famille };
      })
    });
    if (historiqueTirages.length > MAX_HISTORIQUE) historiqueTirages.length = MAX_HISTORIQUE;
    lsSet(KEY_TIRAGES, historiqueTirages);
    rendreHistoriqueTirages();
  }

  function formatDateTirage(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  function rendreHistoriqueTirages() {
    var box = $('tirageHistorique');
    if (!historiqueTirages.length) {
      box.innerHTML = '<p class="muted">Aucun tirage enregistré pour l\'instant.</p>';
      return;
    }
    box.innerHTML = historiqueTirages.map(function (h, i) {
      return '<div class="hist-card">' +
        '<div class="hist-head"><div><b>' + esc(h.spread) + '</b>' +
        '<div class="hist-date">' + esc(formatDateTirage(h.date)) + '</div></div>' +
        '<b class="x" data-del="' + i + '">×</b></div>' +
        '<div class="hist-cartes">' + h.cartes.map(function (c) {
          return '<div class="hist-ligne"><span class="hist-pos">' + esc(c.position) + '</span> — ' + esc(c.nom) + '</div>';
        }).join('') +
        '</div></div>';
    }).join('');
    box.querySelectorAll('.x').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = +btn.dataset.del;
        if (!confirm('Supprimer ce tirage de l\'historique ?')) return;
        historiqueTirages.splice(i, 1);
        lsSet(KEY_TIRAGES, historiqueTirages);
        rendreHistoriqueTirages();
      });
    });
  }

  function effacerHistoriqueTirages() {
    if (!historiqueTirages.length) return;
    if (!confirm('Effacer tout l\'historique des tirages ?')) return;
    historiqueTirages = [];
    lsSet(KEY_TIRAGES, []);
    rendreHistoriqueTirages();
  }

  // ----------------------------- infos -------------------------------------
  function rendreTableLettres() {
    var cols = {};
    for (var v = 1; v <= 9; v++) cols[v] = [];
    Object.keys(N.VALEURS).forEach(function (l) { cols[N.VALEURS[l]].push(l); });
    var html = '';
    for (var i = 1; i <= 9; i++) {
      html += '<div class="tl-col"><b>' + i + '</b>' + cols[i].sort().join('<br>') + '</div>';
    }
    $('tableLettres').innerHTML = html;
  }

  // ----------------------------- init --------------------------------------
  function init() {
    initEcrans();
    initTabs();
    rendreTableLettres();
    initTirage();
    chargerHistoriqueTirages();
    chargerProfils();
    $('verChip').textContent = 'v' + window.APP_VERSION;

    $('calcBtn').addEventListener('click', calculer);
    $('saveBtn').addEventListener('click', function () { enregistrer(); calculer(); });
    $('accordBtn').addEventListener('click', comparer);
    $('tirageBtn').addEventListener('click', tirerCartes);
    $('tirageHistClear').addEventListener('click', effacerHistoriqueTirages);
    $('newProfil').addEventListener('click', function () {
      $('inPrenoms').value = ''; $('inNom').value = ''; $('inDate').value = '';
      $('themeOut').classList.add('hidden');
      showScreen('numerologie');
      $('inPrenoms').focus();
    });

    // recharge le dernier profil consulté
    var actif = lsGet(KEY_ACTIF, null);
    var p = profils.filter(function (x) { return x.id === actif; })[0] || profils[0];
    if (p) {
      $('inPrenoms').value = p.prenoms; $('inNom').value = p.nom; $('inDate').value = p.date;
      calculer();
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(function () { /* hors ligne */ });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
