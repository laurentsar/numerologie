/*
 * interpretations.js — textes d'interpretation.
 *
 * Ces textes sont ORIGINAUX. Ils suivent la grille de lecture classique de la
 * numerologie pythagoricienne, mais ne reproduisent aucun ouvrage. Si tu veux
 * coller au plus pres du « Guide de la Numerologie » de Jean-Daniel Fermier,
 * remplace les chaines ci-dessous : le moteur (numerologie.js) et l'interface
 * (app.js) n'ont pas besoin d'etre touches.
 *
 * Cles disponibles pour chaque table : 1..9 plus 11, 22, 33 quand le nombre
 * maitre a un sens propre. Si une cle manque, l'app retombe sur le nombre
 * reduit (11 -> 2, 22 -> 4, 33 -> 6).
 *
 * Expose window.Interpretations.
 */
(function () {
  'use strict';

  var titres = {
    1: 'Le meneur', 2: "L'associe", 3: "L'expressif", 4: 'Le batisseur',
    5: "L'aventurier", 6: 'Le responsable', 7: 'Le chercheur', 8: 'Le gestionnaire',
    9: "L'humaniste", 11: "L'inspire", 22: 'Le grand batisseur', 33: 'Le passeur'
  };

  var motsCles = {
    1: 'initiative · volonte · autonomie',
    2: 'sensibilite · association · patience',
    3: 'expression · creativite · contact',
    4: 'methode · travail · solidite',
    5: 'liberte · mouvement · experience',
    6: 'responsabilite · harmonie · soin',
    7: 'analyse · interiorite · recherche',
    8: 'ambition · matiere · pouvoir',
    9: 'altruisme · ouverture · achevement',
    11: 'intuition · ideal · rayonnement',
    22: 'vision · construction · grande echelle',
    33: 'devouement · transmission · compassion'
  };

  // Essence courte : sert aux cycles, realisations et partout ou il faut une
  // ligne plutot qu'un paragraphe.
  var essence = {
    1: "Periode ou l'on prend les devants : decisions personnelles, demarrages, affirmation de soi.",
    2: "Periode de patience et d'association : on avance a deux, on laisse murir, on ajuste.",
    3: "Periode d'expression et de contacts : creativite, parole, elargissement du cercle.",
    4: "Periode de construction : travail regulier, mise en ordre, fondations qui tiennent.",
    5: "Periode de mouvement : changements, deplacements, ruptures de routine, imprevus feconds.",
    6: "Periode de responsabilite : famille, engagements, soin porte aux autres et au foyer.",
    7: "Periode de retrait actif : etude, analyse, remise en question, besoin de silence.",
    8: "Periode de puissance concrete : argent, autorite, resultats mesurables, negociations.",
    9: "Periode d'achevement : on solde, on transmet, on libere ce qui a fait son temps.",
    11: "Periode d'inspiration forte : intuitions justes, exposition, exigence interieure elevee.",
    22: "Periode de realisation majeure : un projet de grande ampleur devient concret.",
    33: "Periode de don : ce que l'on a acquis se met au service des autres."
  };

  var cheminDeVie = {
    1: "Votre route demande de decider par vous-meme. Vous progressez en prenant l'initiative, quitte a avancer seul un moment. L'ecueil : confondre autonomie et refus de tout appui. La reussite vient quand vous osez commencer sans attendre l'autorisation.",
    2: "Votre route passe par le lien. Vous avancez mieux a deux, en soutien, en mediation, et vous percevez ce que les autres ne disent pas. L'ecueil : vous effacer jusqu'a disparaitre. Votre force est la patience, pas la soumission.",
    3: "Votre route est celle de l'expression. Parole, ecriture, image, contact : vous existez pleinement quand vous communiquez. L'ecueil : la dispersion, mille debuts et peu d'aboutissements. Choisir un canal et l'approfondir change tout.",
    4: "Votre route est celle du concret. Vous batissez lentement, solidement, et ce que vous posez dure. L'ecueil : la rigidite, la peur du changement, le travail pris pour une fin en soi. Votre securite se construit, elle ne se decrete pas.",
    5: "Votre route est faite de mouvement et d'experiences. Voyages, changements de cap, rencontres : la routine vous eteint. L'ecueil : l'eparpillement et la fuite des engagements. La liberte devient feconde quand elle a une direction.",
    6: "Votre route tourne autour de la responsabilite et de l'harmonie. On compte sur vous, dans la famille comme au travail. L'ecueil : porter les autres jusqu'a l'epuisement, ou vouloir tout arranger. Aider n'est pas se substituer.",
    7: "Votre route demande de comprendre avant d'agir. Etude, observation, vie interieure : vous cherchez le fond des choses. L'ecueil : l'isolement et la distance froide. Votre lucidite vaut surtout quand elle est partagee.",
    8: "Votre route se joue dans le monde concret : argent, pouvoir, organisation, resultats. Vous savez decider et negocier. L'ecueil : reduire la valeur d'une vie a ce qu'elle rapporte. La puissance vous reussit quand elle sert autre chose qu'elle-meme.",
    9: "Votre route depasse votre seul interet. Vous etes tourne vers l'ensemble, sensible a l'injustice, attire par ce qui elargit. L'ecueil : le sacrifice mal place et la difficulte a conclure. Savoir laisser partir fait partie du chemin.",
    11: "Chemin de vie maitre, sur la base du 2. Vous percevez vite et juste, et cela vous expose. Attente elevee envers vous-meme, nervosite, sentiment d'etre decale. Quand l'intuition trouve une forme concrete, votre influence est reelle.",
    22: "Chemin de vie maitre, sur la base du 4. Vous pouvez concretiser une vision large, pas seulement pour vous. Le poids en est proportionnel : exigence, endurance, risque de vous ecraser sous votre propre projet. Batir par etapes est votre securite.",
    33: "Chemin de vie maitre, sur la base du 6. La responsabilite prend une dimension collective : transmettre, soigner, accompagner. L'ecueil est le devouement sans limite. Vous ne pouvez donner longtemps que ce que vous prenez le temps de reconstituer."
  };

  var expression = {
    1: "Vous vous montrez au monde en meneur : direct, autonome, capable de trancher. On vous confie volontiers les departs, quitte a oublier de vous demander votre avis sur le reste.",
    2: "Vous vous montrez conciliant et attentif. On vous cherche pour apaiser, relier, faire tenir un groupe ensemble, au risque qu'on oublie de vous demander ce que vous, vous voulez.",
    3: "Vous vous montrez vivant et communicant. Votre aisance verbale et votre humour ouvrent les portes, parfois au prix d'etre pris moins au serieux que vous ne le voudriez.",
    4: "Vous vous montrez fiable et methodique. On sait que ce que vous annoncez sera fait, dans les regles, meme si cela vous colle une etiquette de personne rigide qu'on n'ose pas trop bousculer.",
    5: "Vous vous montrez adaptable et curieux. Vous changez de registre facilement et supportez mal l'enfermement, ce qui peut donner une image de personne insaisissable, difficile a cerner durablement.",
    6: "Vous vous montrez protecteur et disponible. On vient vers vous pour du conseil et du soutien, et l'on oublie parfois de vous demander comment, vous, vous allez.",
    7: "Vous vous montrez reserve et pointu. Vous parlez peu mais on ecoute quand vous parlez, quitte a passer pour quelqu'un d'inaccessible avant qu'on vous connaisse vraiment.",
    8: "Vous vous montrez sur de vous et efficace. Vous inspirez confiance dans les enjeux materiels, au risque qu'on ne voie que cette facade et pas ce qu'il y a derriere.",
    9: "Vous vous montrez large d'esprit et genereux. Vous portez volontiers des causes qui vous depassent, parfois au point qu'on ne sache plus ce que vous voulez pour vous-meme.",
    11: "Vous degagez quelque chose que l'on remarque sans savoir le nommer. Cela attire autant que cela intimide, et vous laisse rarement passer inapercu meme quand vous le souhaiteriez.",
    22: "Vous inspirez confiance a grande echelle : on vous suit sur des projets que d'autres jugeraient irrealistes, ce qui vous met vite en position de devoir tenir la barre pour tout le monde.",
    33: "Vous rassurez. Votre presence a un effet apaisant, et l'on vous confie des choses importantes, parfois plus que vous n'auriez souhaite en porter."
  };

  var intime = {
    1: "Au fond, vous voulez etre libre de vos decisions et reconnu pour ce que vous entreprenez. Le manque de reconnaissance vous pese plus que vous ne l'admettez.",
    2: "Au fond, vous cherchez la paix et un lien sur, ou l'on ne vous demande pas d'etre en representation. Le conflit ouvert vous coute plus cher qu'a la plupart.",
    3: "Au fond, vous voulez etre entendu et partager ce que vous ressentez, dans la legerete plutot que la lourdeur. Le silence prolonge autour de vous vous pese vraiment.",
    4: "Au fond, vous cherchez la securite : un cadre clair, des choses qui tiennent, peu d'imprevus. L'incertitude prolongee vous use plus qu'elle ne vous stimule.",
    5: "Au fond, vous voulez de l'espace. Toute promesse qui vous enferme vous fait fuir, meme quand vous l'avez souhaitee, et cette contradiction vous est parfois difficile a assumer.",
    6: "Au fond, vous voulez que les vôtres aillent bien. Votre paix depend beaucoup de la leur, ce qui vous rend vulnerable a leurs difficultes autant qu'aux votres.",
    7: "Au fond, vous cherchez a comprendre, et vous avez besoin de solitude pour cela. Ce n'est pas du rejet, mais on vous le reproche parfois comme si c'en etait un.",
    8: "Au fond, vous voulez peser sur le reel et ne plus jamais dependre de personne materiellement. Cette peur de la dependance peut vous pousser a trop en faire seul.",
    9: "Au fond, vous voulez que votre vie ait servi a quelque chose de plus large que vous. Le sentiment d'inutilite vous atteint plus que la plupart des echecs concrets.",
    11: "Au fond, vous aspirez a une justesse rare, et vous vous jugez durement quand vous ne l'atteignez pas. Cette exigence envers vous-meme est rarement visible de l'exterieur.",
    22: "Au fond, vous voulez laisser une trace concrete, quelque chose qui continue sans vous. L'idee de travailler pour rien, sans resultat durable, vous est difficile a supporter.",
    33: "Au fond, vous voulez soulager. Le besoin d'etre utile aux autres est chez vous quasi structurel, au point d'oublier parfois vos propres besoins dans l'equation."
  };

  var realisation = {
    1: "Premiere impression : quelqu'un d'assure, qui sait ou il va. Parfois lu comme autoritaire alors qu'il s'agit surtout d'un besoin d'aller vite et de ne pas dependre des autres pour decider.",
    2: "Premiere impression : quelqu'un de doux et abordable. Parfois lu comme hesitant alors qu'il s'agit d'une vraie volonte de ne blesser ni brusquer personne avant de trancher.",
    3: "Premiere impression : quelqu'un d'agreable et vivant. Parfois lu comme peu serieux alors que l'aisance sociale masque souvent un vrai travail de fond en coulisses.",
    4: "Premiere impression : quelqu'un de solide et carre. Parfois lu comme rigide alors qu'il s'agit avant tout d'un besoin de reperes clairs avant de s'engager.",
    5: "Premiere impression : quelqu'un de vif et insaisissable. Parfois lu comme instable alors que c'est une vraie facilite a se reajuster vite quand le contexte change.",
    6: "Premiere impression : quelqu'un de chaleureux et fiable. Parfois lu comme envahissant alors qu'il s'agit d'un reflexe d'attention qui se declenche avant meme d'y penser.",
    7: "Premiere impression : quelqu'un de distant et profond. Parfois lu comme froid alors qu'il s'agit surtout d'observer avant de se livrer, pas d'un desinteret pour l'autre.",
    8: "Premiere impression : quelqu'un qui impose le respect. Parfois lu comme dur alors qu'il s'agit d'un besoin d'efficacite qui ne supporte pas bien l'approximation.",
    9: "Premiere impression : quelqu'un d'ouvert et bienveillant. Parfois lu comme insaisissable alors qu'il s'agit d'un regard qui embrasse toujours plus large que la situation immediate.",
    11: "Premiere impression : une presence qui ne laisse pas indifferent, difficile a situer. On sent quelque chose sans pouvoir dire tout de suite quoi.",
    22: "Premiere impression : quelqu'un de posé, dont on devine qu'il vise loin. Cette impression de calme cache souvent une charge mentale importante, rarement montree.",
    33: "Premiere impression : quelqu'un vers qui l'on va spontanement se confier. Cette confiance immediate n'est pas toujours meritee au premier abord, mais elle se verifie vite."
  };

  // Nombre actif : le prenom seul, la part la plus spontanee, le reflexe
  // naturel avant reflexion, au quotidien.
  var actif = {
    1: "Votre prénom seul active l'initiative : au quotidien, vous prenez les devants sans y penser. C'est la part de vous qui décide vite, parfois trop vite pour consulter qui que ce soit.",
    2: "Votre prénom seul active l'écoute : vous vous ajustez naturellement à qui est en face de vous. Le revers, c'est l'habitude de vous effacer sans qu'on vous le demande.",
    3: "Votre prénom seul active la parole : vous engagez la conversation, vous détendez l'atmosphère sans effort apparent. Le revers, c'est de parler pour occuper le silence plus que pour dire quelque chose.",
    4: "Votre prénom seul active le sérieux : vous entrez dans une pièce en ayant déjà repéré ce qu'il y a à faire. Le revers, c'est la difficulté à lâcher prise sur le contrôle.",
    5: "Votre prénom seul active le mouvement : vous répondez présent aux imprévus, vous vous ennuyez vite dans la routine. Le revers, c'est l'impatience dès que rien ne bouge.",
    6: "Votre prénom seul active le soin : vous remarquez en premier qui a besoin d'aide dans une pièce. Le revers, c'est l'intervention non sollicitée, meme quand on ne vous l'a pas demandee.",
    7: "Votre prénom seul active l'observation : vous regardez avant d'agir, vous jaugez la situation en silence. Le revers, c'est de rester en retrait plus longtemps que necessaire.",
    8: "Votre prénom seul active l'efficacité : vous allez droit au but, vous jugez vite ce qui marche ou pas. Le revers, c'est l'impatience envers ce qui vous semble improductif.",
    9: "Votre prénom seul active la générosité spontanée : vous donnez de votre temps ou de votre attention sans calculer. Le revers, c'est de vous épuiser pour des causes qui ne vous le rendent pas.",
    11: "Votre prénom seul active une sensibilité vive : vous captez l'ambiance d'une pièce avant même d'y avoir parlé à quiconque. Le revers, c'est la fatigue nerveuse que cette réceptivité entraîne.",
    22: "Votre prénom seul active une vision d'ensemble : vous voyez spontanément comment les pièces d'un projet s'assemblent. Le revers, c'est l'impatience face à qui ne voit pas encore ce que vous voyez déjà.",
    33: "Votre prénom seul active la disponibilité : on vient vers vous sans que vous ayez rien demandé. Le revers, c'est de ne jamais fermer la porte, même quand il faudrait vous préserver."
  };

  // Nombre hereditaire : le nom de famille seul, ce que la lignee transmet
  // sans le dire.
  var hereditaire = {
    1: "Le nom de famille transmet une lignée qui valorise l'indépendance et le fait de se débrouiller seul. Vous avez pu hériter d'exemples marquants d'autonomie, pour le meilleur et pour l'isolement que cela suppose parfois.",
    2: "Le nom de famille transmet une lignée attentive au lien et à l'entente. Vous avez pu hériter d'un sens aigu du compromis, mais aussi d'une difficulté familiale à dire les désaccords franchement.",
    3: "Le nom de famille transmet une lignée expressive, où l'on aime raconter et se faire entendre. Vous avez pu hériter d'une aisance sociale, ou au contraire d'une pression à être toujours le boute-en-train.",
    4: "Le nom de famille transmet une lignée de travailleurs, attachée à la stabilité et à l'ordre. Vous avez pu hériter d'une solidité rassurante, ou d'une exigence de sérieux difficile à décevoir.",
    5: "Le nom de famille transmet une lignée mobile, marquée par des départs, des changements, parfois des ruptures. Vous avez pu hériter d'un goût pour l'ailleurs, ou d'une instabilité familiale jamais vraiment résolue.",
    6: "Le nom de famille transmet une lignée centrée sur la famille et le devoir. Vous avez pu hériter d'un sens fort des responsabilités, ou du poids d'obligations qu'on ne vous a jamais laissé refuser.",
    7: "Le nom de famille transmet une lignée discrète, plutôt tournée vers l'étude ou l'intériorité. Vous avez pu hériter d'une exigence intellectuelle, ou d'une pudeur familiale qui rend les sentiments difficiles à dire.",
    8: "Le nom de famille transmet une lignée marquée par l'argent, le travail ou le statut social. Vous avez pu hériter d'une ambition solide, ou d'une pression familiale à réussir matériellement.",
    9: "Le nom de famille transmet une lignée tournée vers les autres, parfois engagée ou généreuse au-delà du cercle familial. Vous avez pu hériter d'un idéal élevé, ou de la difficulté à recevoir en retour.",
    11: "Le nom de famille transmet une lignée sensible, parfois habitée par des figures marquantes ou hors norme. Vous avez pu hériter d'une intuition affûtée, ou d'attentes familiales difficiles à satisfaire pleinement.",
    22: "Le nom de famille transmet une lignée bâtisseuse, avec des projets ou des réalisations qui ont marqué leur temps. Vous avez pu hériter d'ambitions à la hauteur, ou du poids de devoir continuer ce qui a été commencé avant vous.",
    33: "Le nom de famille transmet une lignée dévouée, où l'on prend soin des autres par tradition. Vous avez pu hériter d'un sens du don précieux, ou de l'habitude de ne jamais compter ce que cela coûte."
  };

  // Nombre d'equilibre : les initiales, la ressource sur laquelle on
  // s'appuie dans les moments difficiles.
  var equilibre = {
    1: "Face à la difficulté, votre appui est de reprendre l'initiative : décider quelque chose, même petit, vous redonne prise sur la situation.",
    2: "Face à la difficulté, votre appui est de vous rapprocher de quelqu'un : parler, être écouté, ne pas rester seul avec le problème.",
    3: "Face à la difficulté, votre appui est de mettre des mots dessus : écrire, raconter, faire sortir ce qui pèse plutôt que le garder.",
    4: "Face à la difficulté, votre appui est de vous organiser : faire une liste, un plan, remettre de l'ordre dans ce qui semble chaotique.",
    5: "Face à la difficulté, votre appui est de changer d'air : bouger, sortir du cadre, prendre de la distance physique avec le problème.",
    6: "Face à la difficulté, votre appui est de vous rendre utile à quelqu'un d'autre : s'occuper des siens détourne et apaise à la fois.",
    7: "Face à la difficulté, votre appui est de vous retirer un moment : comprendre seul avant de réagir, plutôt que de répondre à chaud.",
    8: "Face à la difficulté, votre appui est l'action concrète : reprendre le contrôle sur ce qui est mesurable et gérable.",
    9: "Face à la difficulté, votre appui est de prendre du recul sur l'ensemble : relativiser en se rappelant que cela passera aussi.",
    11: "Face à la difficulté, votre appui est l'intuition : suivre un pressentiment plutôt que de tout vouloir raisonner.",
    22: "Face à la difficulté, votre appui est de se raccrocher à un projet plus grand : la vision d'ensemble remet le problème à sa juste taille.",
    33: "Face à la difficulté, votre appui est de donner : aider quelqu'un d'autre, même en pleine difficulté, vous stabilise."
  };

  // Jour de naissance : talent inne, ce que la personne apporte sans effort
  // particulier (distinct de "essence", qui parle de periodes).
  var talent = {
    1: "Le jour de votre naissance vous donne un talent inné pour initier : vous savez lancer les choses, donner le premier coup d'archet quand personne d'autre n'ose commencer.",
    2: "Le jour de votre naissance vous donne un talent inné pour l'écoute et la médiation : vous sentez ce qui se joue entre les gens, souvent avant qu'ils ne le formulent eux-mêmes.",
    3: "Le jour de votre naissance vous donne un talent inné pour communiquer : vous trouvez les mots ou les images qui font passer une idée que d'autres peinent à expliquer.",
    4: "Le jour de votre naissance vous donne un talent inné pour organiser : vous voyez naturellement comment structurer ce qui est en désordre, sans effort de volonté particulier.",
    5: "Le jour de votre naissance vous donne un talent inné pour vous adapter : les changements de contexte ne vous déstabilisent pas, ils vous stimulent plutôt.",
    6: "Le jour de votre naissance vous donne un talent inné pour prendre soin : vous savez ce dont les autres ont besoin avant qu'ils ne le formulent.",
    7: "Le jour de votre naissance vous donne un talent inné pour analyser : vous repérez ce qui cloche ou ce qui est mal expliqué, presque malgré vous.",
    8: "Le jour de votre naissance vous donne un talent inné pour gérer : les questions d'argent, d'organisation ou de pouvoir ne vous effraient pas comme elles effraient d'autres.",
    9: "Le jour de votre naissance vous donne un talent inné pour rassembler : vous savez faire tenir ensemble des points de vue différents sans forcer personne.",
    11: "Le jour de votre naissance vous donne un talent inné pour percevoir ce qui n'est pas dit : une forme d'antenne sociale ou émotionnelle, difficile à expliquer mais fiable.",
    22: "Le jour de votre naissance vous donne un talent inné pour transformer une idée en projet concret et durable, là où d'autres restent au stade de l'intention.",
    33: "Le jour de votre naissance vous donne un talent inné pour transmettre : expliquer, former, accompagner sans écraser ni se substituer à l'autre."
  };

  var anneePersonnelle = {
    1: "Annee de depart. Ce que vous lancez maintenant marque les neuf annees suivantes. Osez le premier pas, meme imparfait.",
    2: "Annee de patience. Les choses avancent lentement, par les autres. Ne forcez pas : consolidez et attendez le bon moment.",
    3: "Annee d'ouverture. Contacts, creativite, visibilite. Bon moment pour se montrer et pour dire.",
    4: "Annee de travail. Peu de spectaculaire, beaucoup de mise en ordre. C'est l'annee des fondations.",
    5: "Annee de mouvement. Changements, opportunites inattendues, deplacements. Gardez de la souplesse dans vos engagements.",
    6: "Annee de responsabilite. Famille, foyer, engagements. Ce que vous soignez cette annee vous le rendra.",
    7: "Annee de recul. Bilan, formation, interiorite. Mauvaise annee pour forcer, excellente pour comprendre.",
    8: "Annee concrete. Argent, carriere, decisions materielles. Les efforts des annees precedentes se monnaient.",
    9: "Annee de cloture. On termine, on solde, on laisse partir. Ne commencez rien de lourd : faites de la place.",
    11: "Annee d'inspiration intense. Intuitions justes et exposition accrue. Fatigue nerveuse a surveiller.",
    22: "Annee de realisation majeure. Un projet de grande ampleur peut aboutir si vous acceptez le rythme qu'il impose."
  };

  var defis = {
    0: "Aucun defi impose. Rien ne vous contraint de l'exterieur, ce qui est une liberte, mais aussi une absence de garde-fou : c'est a vous de vous donner un cadre.",
    1: "Apprendre a vous affirmer sans ecraser. Trouver votre voix propre sans passer en force ni vous soumettre.",
    2: "Apprendre a vivre votre sensibilite sans en etre le jouet. Sortir de la susceptibilite et de la dependance a l'approbation.",
    3: "Apprendre a vous exprimer vraiment. Depasser la peur du jugement et la tentation de la facade legere.",
    4: "Apprendre la discipline sans rigidite. Accepter le travail patient sans en faire une prison.",
    5: "Apprendre a canaliser le besoin de liberte. Distinguer le mouvement fecond de la fuite.",
    6: "Apprendre a assumer sans vous sacrifier. Aider sans porter la vie des autres a leur place.",
    7: "Apprendre a ne pas vous couper du monde. Votre besoin de retrait ne doit pas devenir un mur.",
    8: "Apprendre un rapport juste a l'argent et au pouvoir. Ni mepris affiche, ni domination."
  };

  var lacunes = {
    1: "Le 1 est absent : l'affirmation de soi ne va pas de soi. Decider pour vous-meme est un apprentissage, pas un reflexe.",
    2: "Le 2 est absent : la patience et le compromis vous coutent. Vous allez droit au but, parfois au detriment du lien.",
    3: "Le 3 est absent : exprimer ce que vous ressentez demande un effort conscient. Le non-dit s'installe vite.",
    4: "Le 4 est absent : la rigueur et la duree ne sont pas naturelles. Les cadres exterieurs vous aident plus que vous ne croyez.",
    5: "Le 5 est absent : le changement inquiete. Vous gagnez a provoquer volontairement de petites ruptures de routine.",
    6: "Le 6 est absent : l'engagement familial ou affectif pese. Il se choisit chez vous, il ne s'impose pas.",
    7: "Le 7 est absent : le recul et l'analyse ne viennent pas seuls. Menagez-vous des temps de silence, sinon vous n'en aurez jamais.",
    8: "Le 8 est absent : le rapport a l'argent et au pouvoir est mal assure. Se former sur ces sujets vaut mieux que les eviter.",
    9: "Le 9 est absent : l'ouverture au-dela du cercle proche demande un pas volontaire. Elle est tres feconde quand vous le faites."
  };

  var dominantes = {
    1: "Le 1 est surrepresente : beaucoup de volonte et d'initiative, avec un risque d'entetement et d'impatience.",
    2: "Le 2 est surrepresente : grande finesse relationnelle, avec un risque d'hypersensibilite et d'indecision.",
    3: "Le 3 est surrepresente : expression abondante, avec un risque de dispersion et de superficialite.",
    4: "Le 4 est surrepresente : forte capacite de travail, avec un risque de rigidite et d'enfermement dans la tache.",
    5: "Le 5 est surrepresente : grande adaptabilite, avec un risque d'instabilite et d'engagements fuyants.",
    6: "Le 6 est surrepresente : sens des responsabilites eleve, avec un risque de sur-implication et d'ingerence.",
    7: "Le 7 est surrepresente : profondeur d'analyse, avec un risque d'isolement et de scepticisme systematique.",
    8: "Le 8 est surrepresente : ambition et sens du concret, avec un risque de durete et de course aux resultats.",
    9: "Le 9 est surrepresente : grande ouverture, avec un risque d'idealisme et de difficulte a conclure."
  };

  window.Interpretations = {
    titres: titres,
    motsCles: motsCles,
    essence: essence,
    cheminDeVie: cheminDeVie,
    expression: expression,
    intime: intime,
    realisation: realisation,
    actif: actif,
    hereditaire: hereditaire,
    equilibre: equilibre,
    talent: talent,
    anneePersonnelle: anneePersonnelle,
    defis: defis,
    lacunes: lacunes,
    dominantes: dominantes,

    /* Recupere un texte, avec repli sur le nombre reduit si la cle maitre
       n'existe pas dans la table demandee (11 -> 2, 22 -> 4, 33 -> 6). */
    get: function (table, n) {
      var t = this[table] || {};
      if (t[n] !== undefined) return t[n];
      var repli = { 11: 2, 22: 4, 33: 6 }[n];
      return repli !== undefined ? (t[repli] || '') : '';
    }
  };
})();
