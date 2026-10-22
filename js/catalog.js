'use strict';
/* Übungskatalog und Standard-Ausrüstung.
   Jede Übung: [Name, Muskelgruppe, Ausrüstung]. Die ID wird stabil aus dem Namen gebildet,
   damit spätere Katalog-Updates bestehende Daten nicht verändern. */

const MUSCLES = [
  'Brust', 'Schultern', 'Trizeps', 'Latissimus', 'Oberer Rücken', 'Trapez', 'Unterer Rücken',
  'Bizeps', 'Unterarme', 'Quadrizeps', 'Beinbizeps', 'Gesäß', 'Waden', 'Adduktoren', 'Abduktoren', 'Bauch'
];

const EQUIPMENT = [
  'Langhantel', 'SZ-Stange', 'Kurzhantel', 'Kabelzug', 'Maschine', 'Multipresse', 'Körpergewicht', 'Kettlebell', 'Band'
];

function rangeList(from, to, step) {
  const out = [];
  for (let v = from; v <= to + 1e-9; v += step) out.push(Math.round(v * 100) / 100);
  return out;
}

const DEFAULT_WEIGHTS = {
  'Langhantel': rangeList(20, 200, 2.5),
  'SZ-Stange': rangeList(10, 80, 2.5),
  'Kurzhantel': rangeList(2.5, 50, 2.5),
  'Kabelzug': rangeList(2.5, 100, 2.5),
  'Maschine': rangeList(5, 200, 5),
  'Multipresse': rangeList(0, 200, 2.5),
  'Körpergewicht': rangeList(0, 50, 2.5),
  'Kettlebell': [4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32],
  'Band': [1, 2, 3, 4, 5]
};

const CATALOG_RAW = [
  // Brust
  ['Bankdrücken', 'Brust', 'Langhantel'],
  ['Schrägbankdrücken', 'Brust', 'Langhantel'],
  ['Negativbankdrücken', 'Brust', 'Langhantel'],
  ['Kurzhantel-Bankdrücken', 'Brust', 'Kurzhantel'],
  ['Kurzhantel-Schrägbankdrücken', 'Brust', 'Kurzhantel'],
  ['Kurzhantel-Negativbankdrücken', 'Brust', 'Kurzhantel'],
  ['Kurzhantel-Fliegende', 'Brust', 'Kurzhantel'],
  ['Kurzhantel-Fliegende Schrägbank', 'Brust', 'Kurzhantel'],
  ['Kabel-Crossover (hoch nach tief)', 'Brust', 'Kabelzug'],
  ['Kabel-Crossover (tief nach hoch)', 'Brust', 'Kabelzug'],
  ['Kabel-Fliegende (mittlere Höhe)', 'Brust', 'Kabelzug'],
  ['Kabel-Brustpresse', 'Brust', 'Kabelzug'],
  ['Brustpresse (Maschine)', 'Brust', 'Maschine'],
  ['Schrägbrustpresse (Maschine)', 'Brust', 'Maschine'],
  ['Butterfly (Maschine)', 'Brust', 'Maschine'],
  ['Plate-Loaded Brustpresse', 'Brust', 'Maschine'],
  ['Multipresse-Bankdrücken', 'Brust', 'Multipresse'],
  ['Multipresse-Schrägbankdrücken', 'Brust', 'Multipresse'],
  ['Liegestütze', 'Brust', 'Körpergewicht'],
  ['Dips (Brustfokus)', 'Brust', 'Körpergewicht'],
  ['Deficit-Liegestütze', 'Brust', 'Körpergewicht'],
  ['Band-Fliegende', 'Brust', 'Band'],

  // Schultern
  ['Schulterdrücken stehend (Military Press)', 'Schultern', 'Langhantel'],
  ['Schulterdrücken sitzend (Langhantel)', 'Schultern', 'Langhantel'],
  ['Push Press', 'Schultern', 'Langhantel'],
  ['Aufrechtes Rudern (Langhantel)', 'Schultern', 'Langhantel'],
  ['Aufrechtes Rudern (SZ-Stange)', 'Schultern', 'SZ-Stange'],
  ['Kurzhantel-Schulterdrücken', 'Schultern', 'Kurzhantel'],
  ['Arnold Press', 'Schultern', 'Kurzhantel'],
  ['Seitheben (Kurzhantel)', 'Schultern', 'Kurzhantel'],
  ['Seitheben liegend auf Schrägbank', 'Schultern', 'Kurzhantel'],
  ['Frontheben (Kurzhantel)', 'Schultern', 'Kurzhantel'],
  ['Reverse Flys vorgebeugt (Kurzhantel)', 'Schultern', 'Kurzhantel'],
  ['Y-Raises auf Schrägbank', 'Schultern', 'Kurzhantel'],
  ['Kabel-Seitheben', 'Schultern', 'Kabelzug'],
  ['Kabel-Frontheben', 'Schultern', 'Kabelzug'],
  ['Kabel-Reverse-Flys', 'Schultern', 'Kabelzug'],
  ['Kabel-Y-Raises', 'Schultern', 'Kabelzug'],
  ['Face Pulls', 'Schultern', 'Kabelzug'],
  ['Schulterpresse (Maschine)', 'Schultern', 'Maschine'],
  ['Seitheben (Maschine)', 'Schultern', 'Maschine'],
  ['Reverse Butterfly (Maschine)', 'Schultern', 'Maschine'],
  ['Multipresse-Schulterdrücken', 'Schultern', 'Multipresse'],
  ['Kettlebell-Schulterdrücken', 'Schultern', 'Kettlebell'],
  ['Pike-Liegestütze', 'Schultern', 'Körpergewicht'],
  ['Band Pull-Aparts', 'Schultern', 'Band'],
  ['Band-Seitheben', 'Schultern', 'Band'],

  // Trizeps
  ['Enges Bankdrücken', 'Trizeps', 'Langhantel'],
  ['JM Press', 'Trizeps', 'Langhantel'],
  ['French Press / Skull Crusher (SZ)', 'Trizeps', 'SZ-Stange'],
  ['Trizepsdrücken über Kopf (SZ)', 'Trizeps', 'SZ-Stange'],
  ['Kurzhantel-Trizepsdrücken über Kopf', 'Trizeps', 'Kurzhantel'],
  ['Kurzhantel-French-Press', 'Trizeps', 'Kurzhantel'],
  ['Kurzhantel-Kickbacks', 'Trizeps', 'Kurzhantel'],
  ['Trizepsdrücken am Kabel (Seil)', 'Trizeps', 'Kabelzug'],
  ['Trizepsdrücken am Kabel (Stange)', 'Trizeps', 'Kabelzug'],
  ['Trizepsdrücken über Kopf (Kabel)', 'Trizeps', 'Kabelzug'],
  ['Einarmiges Trizepsdrücken (Kabel)', 'Trizeps', 'Kabelzug'],
  ['Kabel-Kickbacks', 'Trizeps', 'Kabelzug'],
  ['Trizeps-Dip-Maschine', 'Trizeps', 'Maschine'],
  ['Trizepsstrecker (Maschine)', 'Trizeps', 'Maschine'],
  ['Dips (Trizepsfokus)', 'Trizeps', 'Körpergewicht'],
  ['Bankdips', 'Trizeps', 'Körpergewicht'],
  ['Diamant-Liegestütze', 'Trizeps', 'Körpergewicht'],
  ['Band-Trizepsdrücken', 'Trizeps', 'Band'],

  // Latissimus
  ['Klimmzüge', 'Latissimus', 'Körpergewicht'],
  ['Klimmzüge Untergriff (Chin-ups)', 'Latissimus', 'Körpergewicht'],
  ['Klimmzüge neutraler Griff', 'Latissimus', 'Körpergewicht'],
  ['Assistierte Klimmzüge (Maschine)', 'Latissimus', 'Maschine'],
  ['Latzug breit', 'Latissimus', 'Kabelzug'],
  ['Latzug eng (V-Griff)', 'Latissimus', 'Kabelzug'],
  ['Latzug Untergriff', 'Latissimus', 'Kabelzug'],
  ['Einarmiger Latzug (Kabel)', 'Latissimus', 'Kabelzug'],
  ['Überzüge am Kabel (Straight-Arm Pulldown)', 'Latissimus', 'Kabelzug'],
  ['Latzug (Maschine)', 'Latissimus', 'Maschine'],
  ['Pullover (Maschine)', 'Latissimus', 'Maschine'],
  ['Kurzhantel-Überzüge (Pullover)', 'Latissimus', 'Kurzhantel'],
  ['Langhantelrudern Untergriff', 'Latissimus', 'Langhantel'],
  ['Band-Latzug', 'Latissimus', 'Band'],

  // Oberer Rücken
  ['Langhantelrudern vorgebeugt', 'Oberer Rücken', 'Langhantel'],
  ['Pendlay Row', 'Oberer Rücken', 'Langhantel'],
  ['T-Bar-Rudern', 'Oberer Rücken', 'Langhantel'],
  ['Meadows Row', 'Oberer Rücken', 'Langhantel'],
  ['Seal Row (Langhantel)', 'Oberer Rücken', 'Langhantel'],
  ['Einarmiges Kurzhantelrudern', 'Oberer Rücken', 'Kurzhantel'],
  ['Kurzhantelrudern auf Schrägbank', 'Oberer Rücken', 'Kurzhantel'],
  ['Kurzhantelrudern vorgebeugt (beidarmig)', 'Oberer Rücken', 'Kurzhantel'],
  ['Kabelrudern sitzend (enger Griff)', 'Oberer Rücken', 'Kabelzug'],
  ['Kabelrudern sitzend (breiter Griff)', 'Oberer Rücken', 'Kabelzug'],
  ['Einarmiges Kabelrudern', 'Oberer Rücken', 'Kabelzug'],
  ['Rudermaschine (brustgestützt)', 'Oberer Rücken', 'Maschine'],
  ['T-Bar-Rudern (Maschine)', 'Oberer Rücken', 'Maschine'],
  ['Low Row (Maschine)', 'Oberer Rücken', 'Maschine'],
  ['Multipresse-Rudern', 'Oberer Rücken', 'Multipresse'],
  ['Inverted Rows (Australian Pull-ups)', 'Oberer Rücken', 'Körpergewicht'],
  ['Kettlebell-Rudern', 'Oberer Rücken', 'Kettlebell'],
  ['Band-Rudern', 'Oberer Rücken', 'Band'],

  // Trapez
  ['Shrugs (Langhantel)', 'Trapez', 'Langhantel'],
  ['Shrugs (Kurzhantel)', 'Trapez', 'Kurzhantel'],
  ['Shrugs (Kabel)', 'Trapez', 'Kabelzug'],
  ['Shrugs (Maschine)', 'Trapez', 'Maschine'],
  ['Shrugs (Multipresse)', 'Trapez', 'Multipresse'],

  // Unterer Rücken
  ['Kreuzheben', 'Unterer Rücken', 'Langhantel'],
  ['Rack Pulls', 'Unterer Rücken', 'Langhantel'],
  ['Good Mornings', 'Unterer Rücken', 'Langhantel'],
  ['Hyperextensions (Rückenstrecker)', 'Unterer Rücken', 'Körpergewicht'],
  ['Rückenstrecker (Maschine)', 'Unterer Rücken', 'Maschine'],
  ['Superman', 'Unterer Rücken', 'Körpergewicht'],

  // Bizeps
  ['Langhantel-Curls', 'Bizeps', 'Langhantel'],
  ['SZ-Curls', 'Bizeps', 'SZ-Stange'],
  ['Scottcurls (SZ)', 'Bizeps', 'SZ-Stange'],
  ['Kurzhantel-Curls', 'Bizeps', 'Kurzhantel'],
  ['Hammer Curls', 'Bizeps', 'Kurzhantel'],
  ['Konzentrationscurls', 'Bizeps', 'Kurzhantel'],
  ['Schrägbank-Curls', 'Bizeps', 'Kurzhantel'],
  ['Spider Curls', 'Bizeps', 'Kurzhantel'],
  ['Scottcurls (Kurzhantel)', 'Bizeps', 'Kurzhantel'],
  ['Zottman Curls', 'Bizeps', 'Kurzhantel'],
  ['Kabel-Curls (Stange)', 'Bizeps', 'Kabelzug'],
  ['Kabel-Hammer-Curls (Seil)', 'Bizeps', 'Kabelzug'],
  ['Bayesian Curls (Kabel)', 'Bizeps', 'Kabelzug'],
  ['Einarmige Kabel-Curls', 'Bizeps', 'Kabelzug'],
  ['Bizepsmaschine', 'Bizeps', 'Maschine'],
  ['Scottcurl-Maschine', 'Bizeps', 'Maschine'],
  ['Kettlebell-Curls', 'Bizeps', 'Kettlebell'],
  ['Band-Curls', 'Bizeps', 'Band'],

  // Unterarme
  ['Reverse Curls (SZ)', 'Unterarme', 'SZ-Stange'],
  ['Handgelenkcurls (Langhantel)', 'Unterarme', 'Langhantel'],
  ['Handgelenkcurls (Kurzhantel)', 'Unterarme', 'Kurzhantel'],
  ['Reverse Handgelenkcurls (Kurzhantel)', 'Unterarme', 'Kurzhantel'],
  ['Farmer\'s Walk', 'Unterarme', 'Kurzhantel'],
  ['Dead Hang', 'Unterarme', 'Körpergewicht'],

  // Quadrizeps
  ['Kniebeugen', 'Quadrizeps', 'Langhantel'],
  ['Frontkniebeugen', 'Quadrizeps', 'Langhantel'],
  ['Pause Squats', 'Quadrizeps', 'Langhantel'],
  ['Ausfallschritte (Langhantel)', 'Quadrizeps', 'Langhantel'],
  ['Goblet Squats', 'Quadrizeps', 'Kurzhantel'],
  ['Bulgarian Split Squats', 'Quadrizeps', 'Kurzhantel'],
  ['Ausfallschritte (Kurzhantel)', 'Quadrizeps', 'Kurzhantel'],
  ['Ausfallschritte gehend', 'Quadrizeps', 'Kurzhantel'],
  ['Step-ups', 'Quadrizeps', 'Kurzhantel'],
  ['Beinpresse', 'Quadrizeps', 'Maschine'],
  ['Beinpresse einbeinig', 'Quadrizeps', 'Maschine'],
  ['Beinstrecker', 'Quadrizeps', 'Maschine'],
  ['Hackenschmidt-Kniebeugen', 'Quadrizeps', 'Maschine'],
  ['Pendulum Squat', 'Quadrizeps', 'Maschine'],
  ['Belt Squat', 'Quadrizeps', 'Maschine'],
  ['V-Squat (Maschine)', 'Quadrizeps', 'Maschine'],
  ['Multipresse-Kniebeugen', 'Quadrizeps', 'Multipresse'],
  ['Multipresse-Split-Squats', 'Quadrizeps', 'Multipresse'],
  ['Sissy Squats', 'Quadrizeps', 'Körpergewicht'],
  ['Kniebeugen (Körpergewicht)', 'Quadrizeps', 'Körpergewicht'],
  ['Kettlebell-Goblet-Squats', 'Quadrizeps', 'Kettlebell'],

  // Beinbizeps
  ['Rumänisches Kreuzheben', 'Beinbizeps', 'Langhantel'],
  ['Kreuzheben mit gestreckten Beinen', 'Beinbizeps', 'Langhantel'],
  ['Rumänisches Kreuzheben (Kurzhantel)', 'Beinbizeps', 'Kurzhantel'],
  ['Einbeiniges Rumänisches Kreuzheben', 'Beinbizeps', 'Kurzhantel'],
  ['Beinbeuger liegend', 'Beinbizeps', 'Maschine'],
  ['Beinbeuger sitzend', 'Beinbizeps', 'Maschine'],
  ['Beinbeuger stehend (einbeinig)', 'Beinbizeps', 'Maschine'],
  ['Glute-Ham-Raise', 'Beinbizeps', 'Körpergewicht'],
  ['Nordic Curls', 'Beinbizeps', 'Körpergewicht'],
  ['Kabel-Beinbeuger stehend', 'Beinbizeps', 'Kabelzug'],
  ['Multipresse-Rumänisches-Kreuzheben', 'Beinbizeps', 'Multipresse'],

  // Gesäß
  ['Hip Thrusts', 'Gesäß', 'Langhantel'],
  ['Glute Bridge (Langhantel)', 'Gesäß', 'Langhantel'],
  ['Sumo-Kreuzheben', 'Gesäß', 'Langhantel'],
  ['Rückwärts-Ausfallschritte', 'Gesäß', 'Kurzhantel'],
  ['Hip-Thrust-Maschine', 'Gesäß', 'Maschine'],
  ['Gesäß-Kickback (Maschine)', 'Gesäß', 'Maschine'],
  ['Kabel-Kickbacks (Gesäß)', 'Gesäß', 'Kabelzug'],
  ['Kabel-Pull-Through', 'Gesäß', 'Kabelzug'],
  ['Multipresse-Hip-Thrusts', 'Gesäß', 'Multipresse'],
  ['Kettlebell Swings', 'Gesäß', 'Kettlebell'],
  ['Glute Bridge (Körpergewicht)', 'Gesäß', 'Körpergewicht'],
  ['Band-Glute-Bridge', 'Gesäß', 'Band'],

  // Waden
  ['Wadenheben stehend (Maschine)', 'Waden', 'Maschine'],
  ['Wadenheben sitzend (Maschine)', 'Waden', 'Maschine'],
  ['Wadenheben an der Beinpresse', 'Waden', 'Maschine'],
  ['Wadenheben (Multipresse)', 'Waden', 'Multipresse'],
  ['Einbeiniges Wadenheben (Kurzhantel)', 'Waden', 'Kurzhantel'],
  ['Wadenheben (Körpergewicht)', 'Waden', 'Körpergewicht'],

  // Adduktoren / Abduktoren
  ['Adduktorenmaschine', 'Adduktoren', 'Maschine'],
  ['Kabel-Adduktion', 'Adduktoren', 'Kabelzug'],
  ['Copenhagen Plank', 'Adduktoren', 'Körpergewicht'],
  ['Abduktorenmaschine', 'Abduktoren', 'Maschine'],
  ['Kabel-Abduktion', 'Abduktoren', 'Kabelzug'],
  ['Band-Abduktion (Monster Walk)', 'Abduktoren', 'Band'],

  // Bauch
  ['Crunches', 'Bauch', 'Körpergewicht'],
  ['Negativ-Crunches', 'Bauch', 'Körpergewicht'],
  ['Hängendes Beinheben', 'Bauch', 'Körpergewicht'],
  ['Beinheben am Dip-Barren', 'Bauch', 'Körpergewicht'],
  ['Ab-Wheel Rollout', 'Bauch', 'Körpergewicht'],
  ['Plank (Sekunden)', 'Bauch', 'Körpergewicht'],
  ['Russian Twists', 'Bauch', 'Körpergewicht'],
  ['Kabel-Crunches', 'Bauch', 'Kabelzug'],
  ['Pallof Press', 'Bauch', 'Kabelzug'],
  ['Woodchopper (Kabel)', 'Bauch', 'Kabelzug'],
  ['Bauchmaschine (Crunch)', 'Bauch', 'Maschine'],
  ['Kettlebell-Russian-Twists', 'Bauch', 'Kettlebell']
];

function slugify(s) {
  return 'c-' + s.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const CATALOG = CATALOG_RAW.map(([name, muscle, equipment]) => ({
  id: slugify(name), name, muscle, equipment, custom: false
}));
