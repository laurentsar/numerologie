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
    { nom: 'Le Mat', motsCles: 'espoir neuf, prendre des risques, nouveaux departs',
      texte: "Cette carte invite a sauter sans tout calculer a l'avance : un depart, une decision audacieuse, la confiance dans l'inconnu. Le risque est de partir sans aucune preparation et de le payer plus tard." },
    { nom: 'Le Bateleur', motsCles: 'creativite ciblee, une vision qui devient reelle, action inspiree',
      texte: "Cette carte signale que vous avez deja les outils en main pour concretiser une idee : il ne manque que le premier geste. Attention a ne pas confondre habilete et improvisation permanente." },
    { nom: "La Papesse", motsCles: 'secrets, mystere, intuition, faire confiance a soi',
      texte: "Cette carte pousse a ecouter ce que vous savez deja sans le dire, une intuition ou une information pas encore partagee. Le risque est de rester dans le secret plus longtemps que necessaire." },
    { nom: "L'Imperatrice", motsCles: 'fertilite, creation, abondance, bonne parentalite',
      texte: "Cette carte parle de creation et d'abondance qui prend forme : un projet, une naissance, une periode fertile. L'exces peut mener a trop en faire, ou a trop materner ce qui devrait deja voler de ses propres ailes." },
    { nom: "L'Empereur", motsCles: 'respect, leadership, strategie, figure paternelle',
      texte: "Cette carte appelle a structurer, poser un cadre, assumer une autorite legitime. Le risque est la rigidite : imposer une regle plutot que la construire avec les autres." },
    { nom: 'Le Pape', motsCles: 'traditions, attentes conventionnelles, conformite',
      texte: "Cette carte renvoie a une tradition, une regle ou un conseil exterieur qui fait autorite dans la situation. Elle invite a se demander si vous suivez ce cadre par conviction ou par simple habitude." },
    { nom: "L'Amoureux", motsCles: 'partenariat, amour profond, un choix, la force du duo',
      texte: "Cette carte marque un choix important, souvent affectif, ou la necessite de trancher entre deux options qui comptent vraiment. Elle rappelle qu'une union durable se construit a deux, pas en imposant sa vision seul." },
    { nom: 'Le Chariot', motsCles: 'action et changement, un voyage, un nouveau vehicule',
      texte: "Cette carte indique qu'il faut avancer avec determination, malgre des forces qui tirent dans des directions opposees. La victoire vient de garder le cap, pas de forcer sans direction claire." },
    { nom: 'La Force', motsCles: 'amour de soi, amour inconditionnel, respect de soi, courage',
      texte: "Cette carte parle de maitrise douce plutot que de domination : tenir bon avec calme face a ce qui vous depasse. Le veritable courage ici est la patience, pas l'affrontement direct." },
    { nom: "L'Hermite", motsCles: 'aller chercher en soi, quete de verite personnelle, illumination',
      texte: "Cette carte invite au retrait volontaire pour y voir plus clair, seul avec ses propres reponses. Le risque est de s'isoler au point de couper le lien avec ceux qui pourraient aider." },
    { nom: 'La Roue de Fortune', motsCles: 'bonne fortune, un tournant, chance au jeu',
      texte: "Cette carte marque un tournant impose par les circonstances, positif ou negatif selon la maniere dont vous l'accueillez. Elle rappelle que rien n'est fige : ce qui monte peut redescendre, et inversement." },
    { nom: 'La Justice', motsCles: 'cause a effet, solutions gagnant-gagnant, la verite eclate',
      texte: "Cette carte annonce qu'une situation trouve son juste equilibre, une decision equitable ou la consequence logique d'actes passes. Elle invite a assumer sa part de responsabilite plutot qu'a chercher un coupable." },
    { nom: 'Le Pendu', motsCles: 'sagesse, sacrifice de soi, changer de perspective',
      texte: "Cette carte demande d'accepter une pause forcee et de changer d'angle plutot que de forcer une issue. Ce qui ressemble a un sacrifice aujourd'hui peut se reveler une lecon utile plus tard." },
    { nom: "L'Arcane sans nom", motsCles: 'grands changements, fins, passer a autre chose, renaissance',
      texte: "Cette carte annonce une fin necessaire pour qu'autre chose puisse commencer, un cycle qui se cloture. La resistance au changement fait souvent plus mal que le changement lui-meme." },
    { nom: 'Temperance', motsCles: 'equilibre, harmonie, patience, moderation',
      texte: "Cette carte parle de dosage juste : melanger deux choses qui semblaient incompatibles pour trouver un equilibre nouveau. Elle recompense la patience plus que l'urgence." },
    { nom: 'Le Diable', motsCles: 'dependance, avidite, envie, materialisme, obsession',
      texte: "Cette carte pointe une dependance ou un attachement qui limite votre liberte, financier, affectif ou autre. Elle rappelle que les chaines qu'elle montre sont souvent plus laches qu'elles n'en ont l'air." },
    { nom: 'La Maison Dieu', motsCles: 'changement non desire, bouleversement, ruine, rupture',
      texte: "Cette carte annonce une rupture brutale avec une structure qui semblait solide, une verite qui eclate d'un coup. Aussi violent que ce soit, ce qui s'effondre etait deja fragilise avant." },
    { nom: "L'Etoile", motsCles: 'renouveau, espoir, clarte interieure, avoir foi',
      texte: "Cette carte apporte un repit apres une epreuve, une lueur d'espoir fondee et pas seulement un vœu pieux. Elle invite a se reconnecter a ce qui vous inspire vraiment." },
    { nom: 'La Lune', motsCles: 'problemes caches, changements volontaires, ecouter son intuition',
      texte: "Cette carte signale une zone d'ombre, une part de la situation qui n'est pas encore claire ou qui joue sur vos peurs. Se fier a son intuition vaut mieux ici que forcer une certitude qui n'existe pas encore." },
    { nom: 'Le Soleil', motsCles: 'bonheur concret, issue joyeuse, reussite',
      texte: "Cette carte annonce une reussite lisible et partagee, un moment de clarte et de joie simple. Elle recompense rarement le hasard : c'est souvent la suite logique d'efforts anterieurs." },
    { nom: 'Le Jugement', motsCles: 'clarte, une decision finale, un signal de reveil, sa raison d\'etre',
      texte: "Cette carte marque un bilan qui ne trompe plus personne, un appel a assumer qui vous etes devenu. Elle demande de repondre present a ce qui vous est propose, pas de le laisser passer." },
    { nom: 'Le Monde', motsCles: 'accomplir un but ou une lecon, depart, voyage, achevement',
      texte: "Cette carte marque un accomplissement complet, la fin d'un cycle reussi avant l'ouverture d'un autre. Elle invite a savourer l'arrivee avant de foncer deja vers le prochain objectif." }
  ];

  // Arcanes mineurs : 4 familles x 14 cartes (As a Roi)
  var rangs = ['As', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit', 'Neuf', 'Dix', 'Valet', 'Cavalier', 'Reine', 'Roi'];

  var familles = {
    coupes: {
      nom: 'Coupes', theme: 'eau · emotions',
      cartes: [
        { motsCles: 'nouvelle naissance ou relation, demande en mariage, mariage',
          texte: "Cette carte annonce un elan emotionnel neuf, un amour ou un projet qui nait avec une vraie sincerite. Elle demande d'accueillir ce qui commence sans deja vouloir tout controler." },
        { motsCles: 'amour naissant, partenariat, demande en mariage, mariage',
          texte: "Cette carte marque une vraie rencontre, une reciprocite qui s'installe entre deux personnes. Elle fonctionne quand les deux parties donnent autant qu'elles recoivent." },
        { motsCles: 'amitie, celebrations, un cercle de soutien',
          texte: "Cette carte parle de joie partagee, un cercle d'amis ou une celebration qui fait du bien. Elle rappelle l'importance de ne pas rester isole dans les bons moments non plus." },
        { motsCles: 'apathie, sentiment d\'inassouvissement, cadeau surprise',
          texte: "Cette carte pointe une lassitude ou une indifference face a ce qui est propose, alors qu'une opportunite reelle attend d'etre remarquee. Elle invite a relever la tete avant de refuser par automatisme." },
        { motsCles: 'perte, regret, chagrin, se sentir delaisse ou mal aime',
          texte: "Cette carte parle d'une perte qui pese, en insistant sur ce qui manque plutot que sur ce qui reste. Elle rappelle que deux coupes sont encore debout, meme quand on ne les voit pas." },
        { motsCles: 'nostalgie, cadeaux, innocence, retrouvailles',
          texte: "Cette carte ramene vers le passe, la nostalgie, ou des retrouvailles qui font du bien. Le risque est d'idealiser ce qui etait, au point de ne plus voir ce qui est possible maintenant." },
        { motsCles: 'trop de choix, difficulte a s\'engager',
          texte: "Cette carte montre trop de possibilites a la fois, un choix rendu difficile par l'illusion et la confusion. Elle demande de trier ce qui est reellement accessible de ce qui n'est qu'un mirage." },
        { motsCles: 'retrait, repli, tourner la page, abandon',
          texte: "Cette carte marque le moment de partir alors que tout semblait acquis, parce que quelque chose de plus important appelle ailleurs. Ce depart n'est pas un echec, c'est une decision assumee." },
        { motsCles: 'voeux exauces, abondance materielle, bonne sante',
          texte: "Cette carte annonce une satisfaction reelle, des souhaits qui se realisent et un bien-etre tangible. Elle invite a en profiter sans deja s'inquieter de la suite." },
        { motsCles: 'contentement familial, amour et soutien total',
          texte: "Cette carte parle d'harmonie familiale et affective durable, un bonheur qui ne depend pas d'un seul evenement. Elle recompense ce qui a ete construit patiemment a plusieurs." },
        { motsCles: 'un enfant studieux, un nouvel amour, benevolat',
          texte: "Cette carte evoque une emotion naissante, curieuse et un peu naive, comme une premiere fois. Elle invite a rester ouvert sans se blinder par avance." },
        { motsCles: 'un prince ou une princesse charmante, romance, demande',
          texte: "Cette carte annonce une proposition romantique ou une offre seduisante qui merite d'etre prise au serieux. Elle demande de verifier que les actes suivent les belles paroles." },
        { motsCles: 'une personne nourriciere, guerison, soutien',
          texte: "Cette carte incarne une ecoute emotionnelle profonde, la capacite a accueillir ce que l'autre traverse sans juger. Elle invite a garder une limite claire pour ne pas se laisser submerger par l'emotion d'autrui." },
        { motsCles: 'un leader bienveillant, tolerance, empathie',
          texte: "Cette carte parle de maitrise emotionnelle, la capacite a rester stable et bienveillant meme sous pression. Elle rappelle que la sensibilite bien geree est une force, pas une faiblesse a cacher." }
      ]
    },
    deniers: {
      nom: 'Deniers', theme: 'terre · materiel',
      cartes: [
        { motsCles: 'nouvel emploi, augmentation, promotion, investissement',
          texte: "Cette carte annonce une opportunite concrete, financiere ou professionnelle, qui merite d'etre saisie serieusement. Elle recompense qui pose les bases correctement des le depart." },
        { motsCles: 'deux choix, jongler entre plusieurs options',
          texte: "Cette carte parle de jonglage entre plusieurs priorites materielles, un equilibre a tenir plutot qu'un choix definitif a faire. Elle demande de la souplesse sans perdre le fil de ce qui compte vraiment." },
        { motsCles: 'travail d\'equipe, collaboration, competence, savoir-faire',
          texte: "Cette carte valorise le travail bien fait en equipe, chacun apportant une competence complementaire. Elle rappelle que la reconnaissance vient rarement d'un travail fait seul dans son coin." },
        { motsCles: 'avidite ou besoin de securite a long terme',
          texte: "Cette carte pointe un attachement excessif a la securite materielle, au point de se fermer a toute prise de risque. Elle demande de distinguer prudence legitime et peur deguisee." },
        { motsCles: 'sante fragile, precarite, inquietude, isolement, perte financiere',
          texte: "Cette carte parle d'une periode de manque, materiel ou de soutien, plus dure a vivre qu'a expliquer. Elle rappelle qu'une aide existe souvent tout pres, meme quand on se sent seul face a la difficulte." },
        { motsCles: 'donner ou recevoir de l\'aide, generosite',
          texte: "Cette carte parle d'echange juste, donner ou recevoir de l'aide dans un rapport equilibre. Elle invite a verifier que la generosite ne cree pas de dependance d'un cote comme de l'autre." },
        { motsCles: 'patience, travail acharne, reussite differee, attendre',
          texte: "Cette carte demande de la patience apres un investissement deja fait, sans certitude immediate sur le resultat. Elle recompense qui sait attendre le bon moment pour recolter." },
        { motsCles: 'maitriser son art, s\'epanouir dans son travail',
          texte: "Cette carte valorise l'apprentissage assidu d'un savoir-faire, la repetition qui mene a la maitrise. Elle rappelle que la competence se construit sur la duree, rarement d'un coup." },
        { motsCles: 'luxe, autosuffisance, gain financier',
          texte: "Cette carte annonce une reussite materielle obtenue par ses propres moyens, source d'une vraie satisfaction personnelle. Elle invite a en profiter sans culpabiliser de l'avoir merite." },
        { motsCles: 'laisser un heritage, retraite, transmission',
          texte: "Cette carte parle d'heritage et de securite installee sur le long terme, au-dela d'une seule generation. Elle rappelle que la vraie richesse inclut ce qui se transmet, pas seulement ce qui se possede." },
        { motsCles: 'un enfant patient, une nouvelle situation, une bonne nouvelle financiere',
          texte: "Cette carte evoque un projet ou une opportunite encore jeune, qui demande du serieux pour se concretiser. Elle invite a apprendre patiemment plutot qu'a vouloir des resultats immediats." },
        { motsCles: 'une personne fiable, patience, travail assidu',
          texte: "Cette carte parle d'avancee methodique et fiable, sans eclat mais sans faux pas non plus. Elle demande parfois d'accelerer un peu quand la lenteur devient un pretexte." },
        { motsCles: 'une personne debrouillarde, fertilite, sens du foyer',
          texte: "Cette carte incarne un sens pratique nourricier, la capacite a rendre un foyer ou un projet concretement vivable. Elle rappelle de ne pas s'oublier en s'occupant du confort de tout le monde." },
        { motsCles: 'un leader solide et pragmatique, investisseur avise',
          texte: "Cette carte parle de reussite materielle stable, construite avec methode et sur la duree. Elle invite a rester genereux avec cette reussite plutot qu'a la garder jalousement." }
      ]
    },
    epees: {
      nom: 'Epees', theme: 'air · intellect',
      cartes: [
        { motsCles: 'idees nouvelles, nouveau conflit, chirurgie, clarte mentale',
          texte: "Cette carte annonce une clarte mentale nouvelle, une verite qui se degage nettement d'une situation confuse. Elle peut aussi ouvrir un conflit necessaire pour que cette verite soit dite." },
        { motsCles: 'temps du compromis ou de la decision',
          texte: "Cette carte montre une decision mise en suspens, souvent parce que les deux options font mal a leur maniere. Elle rappelle que l'indecision prolongee est elle-meme un choix, avec ses consequences." },
        { motsCles: 'chagrin, rupture, perte, depression, chirurgie',
          texte: "Cette carte parle d'une douleur nette, une rupture ou une deception qui touche en plein cœur. Elle rappelle que nommer la douleur est deja le debut du chemin pour la traverser." },
        { motsCles: 'repli, repos, renouveau, solitude, convalescence',
          texte: "Cette carte demande une pause reelle apres une periode d'effort ou de tension. Elle rappelle que le repos n'est pas un luxe mais une condition pour repartir correctement." },
        { motsCles: 'brimades, vol, violence, relations toxiques',
          texte: "Cette carte parle d'un conflit gagne a un cout trop eleve, une victoire qui laisse un gout amer. Elle invite a se demander si avoir raison valait la relation abimee au passage." },
        { motsCles: 'une transition necessaire, demenagement',
          texte: "Cette carte marque un depart necessaire vers une situation plus calme, meme si le chemin pour y arriver est encore incertain. Elle recompense qui accepte de laisser une difficulte derriere soi." },
        { motsCles: 'vol, trahison, malhonnetete, fuite',
          texte: "Cette carte pointe une strategie discrete, parfois a la limite de l'honnetete, pour eviter un affrontement direct. Elle invite a se demander si le contournement choisi est vraiment necessaire." },
        { motsCles: 'restrictions auto-imposees, isolement, sentiment d\'enfermement',
          texte: "Cette carte montre un sentiment de blocage qui vient surtout de la perception de la situation, plus que de la situation elle-meme. Les liens qui retiennent sont souvent moins serres qu'ils n'en ont l'air." },
        { motsCles: 'cauchemars, anxiete, chagrin, depression',
          texte: "Cette carte parle d'angoisse nocturne, de ruminations qui grossissent un probleme au-dela de sa realite. Elle invite a en parler a quelqu'un plutot qu'a rester seul avec cette charge mentale." },
        { motsCles: 'une fin douloureuse et complete, toucher le fond',
          texte: "Cette carte marque une fin nette et douloureuse, mais aussi le point le plus bas avant que la situation ne puisse que remonter. Rien de pire ne peut suivre ce que cette carte decrit deja." },
        { motsCles: 'un enfant curieux, ragots, indiscretion, verite qui sort',
          texte: "Cette carte evoque une curiosite vive, parfois indiscrete, qui cherche a savoir avant de comprendre vraiment. Elle invite a verifier une information avant de la relayer." },
        { motsCles: 'une personne au verbe rapide, changement de vie',
          texte: "Cette carte annonce une action rapide, tranchante, parfois precipitee, portee par une conviction forte. Elle demande de verifier que la vitesse ne remplace pas la reflexion necessaire." },
        { motsCles: 'une personne autonome, honnetete totale',
          texte: "Cette carte incarne une lucidite sans complaisance, la capacite a dire une verite inconfortable clairement. Elle rappelle que cette franchise gagne a s'accompagner d'un peu de tact." },
        { motsCles: 'un leader strategique et volontaire',
          texte: "Cette carte parle d'autorite fondee sur la raison et la strategie plutot que sur l'emotion. Elle invite a ne pas laisser cette rigueur intellectuelle devenir une froideur relationnelle." }
      ]
    },
    batons: {
      nom: 'Batons', theme: 'feu · creativite',
      cartes: [
        { motsCles: 'nouveau projet, inspiration, l\'envie de creer',
          texte: "Cette carte annonce une impulsion creative forte, l'envie de se lancer dans quelque chose de neuf. Elle demande de transformer cette envie en premier pas concret avant qu'elle ne retombe." },
        { motsCles: 'attendre des resultats, faire un choix, projets de voyage',
          texte: "Cette carte parle d'un projet deja lance qui attend maintenant sa suite, un choix de direction a faire. Elle invite a elargir son horizon plutot qu'a se contenter du premier succes obtenu." },
        { motsCles: 'travail d\'equipe, commerce, expansion, voyage',
          texte: "Cette carte marque une expansion en cours, les premiers resultats d'un projet qui commence a porter ses fruits ailleurs. Elle recompense la patience de qui a prepare le terrain a l'avance." },
        { motsCles: 'retour au foyer, celebrations, famille, amis, retrouvailles',
          texte: "Cette carte celebre une etape franchie avec succes, une reunion ou une fete meritee. Elle rappelle l'importance de marquer les reussites avant d'enchainer sur autre chose." },
        { motsCles: 'rivalite, defis, obstacles, competition',
          texte: "Cette carte parle de competition ou de tensions entre plusieurs volontes qui tirent chacune dans leur sens. Elle invite a canaliser cette energie plutot qu'a la laisser degenerer en conflit sterile." },
        { motsCles: 'victoire, reconnaissance, bonnes nouvelles, succes',
          texte: "Cette carte annonce une reconnaissance publique, une victoire qui se voit et se partage. Elle invite a l'accueillir sans fausse modestie, tout en restant les pieds sur terre." },
        { motsCles: 'defense de soi, se proteger de la concurrence',
          texte: "Cette carte demande de defendre une position acquise face a une pression ou une remise en question. Elle rappelle que tenir bon a du sens quand la position vaut vraiment la peine d'etre defendue." },
        { motsCles: 'rapidite, action, changement soudain, nouvelles qui arrivent',
          texte: "Cette carte annonce une acceleration soudaine, des nouvelles ou des evenements qui arrivent vite. Elle invite a rester reactif sans se laisser deborder par le rythme impose." },
        { motsCles: 'poser et tenir ses limites, perseverance',
          texte: "Cette carte parle d'une resistance construite apres plusieurs epreuves deja traversees, une vigilance qui a fait ses preuves. Elle rappelle qu'il est possible de tenir encore un peu, meme fatigue." },
        { motsCles: 'stress, epuisement, trop de charges a porter',
          texte: "Cette carte pointe une surcharge, trop de responsabilites portees a la fois, souvent volontairement accumulees. Elle invite a se demander ce qui peut etre repose ou delegue avant de vous ecraser." },
        { motsCles: 'un enfant actif, un nouveau projet ou une idee creative',
          texte: "Cette carte evoque un enthousiasme neuf pour un projet ou une idee, plein d'energie mais encore inexperimente. Elle invite a garder cet elan tout en acceptant d'apprendre en chemin." },
        { motsCles: 'une personne passionnee et libre, creativite',
          texte: "Cette carte annonce un depart impulsif, motive par l'envie d'aventure plus que par un plan detaille. Elle demande de garder un minimum de cap pour que l'elan ne s'essouffle pas en route." },
        { motsCles: 'une personne fougueuse, confiance, assurance',
          texte: "Cette carte incarne une confiance rayonnante et chaleureuse, capable de motiver les autres par sa seule presence. Elle rappelle de laisser aussi de la place aux idees de ceux qu'elle inspire." },
        { motsCles: 'un leader audacieux, pouvoir, charme, courage',
          texte: "Cette carte parle de leadership visionnaire, la capacite a entrainer un groupe vers un objectif ambitieux. Elle invite a rester a l'ecoute pour que l'audace ne devienne pas de l'autoritarisme." }
      ]
    }
  };

  var deck = [];
  majeurs.forEach(function (c, i) {
    deck.push({ id: 'M' + i, nom: c.nom, famille: 'Arcane majeur', numero: i, motsCles: c.motsCles, texte: c.texte });
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
        motsCles: f.cartes[i].motsCles,
        texte: f.cartes[i].texte
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
