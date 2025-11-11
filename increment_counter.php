<?php
// Définit l'en-tête pour s'assurer que le navigateur comprend la réponse (texte simple)
header('Content-Type: text/plain');

// Nom du fichier de stockage du compteur
$fichier_compteur = 'Visit.txt';

// --- 1. Gérer l'accès concurrent (Verrouillage du fichier) ---
// Utiliser LOCK_EX pour verrouiller le fichier pendant la lecture/écriture afin d'éviter la corruption
// en cas de multiples accès simultanés.

// Ouvrir le fichier en mode lecture/écriture ('c+' pour créer s'il n'existe pas)
$file_handle = fopen($fichier_compteur, 'c+');

if ($file_handle === false) {
    // Échec de l'ouverture ou de la création du fichier
    http_response_code(500);
    die("Erreur: Impossible d'ouvrir ou de créer le fichier de compteur.");
}

// Tenter de verrouiller le fichier
if (flock($file_handle, LOCK_EX)) {
    // Réinitialiser le pointeur au début
    rewind($file_handle);

    // --- 2. Lire la valeur actuelle ---
    $compteur = (int)trim(fgets($file_handle));

    // --- 3. Incrémenter la valeur ---
    $compteur++;

    // --- 4. Écrire la nouvelle valeur ---
    // Tronquer le fichier à zéro avant l'écriture
    ftruncate($file_handle, 0); 
    // Réécrire la nouvelle valeur
    fwrite($file_handle, $compteur);

    // Libérer le verrou
    flock($file_handle, LOCK_UN);
} else {
    // Échec du verrouillage
    http_response_code(503);
    die("Service indisponible temporairement.");
}

// --- 5. Fermer le fichier et afficher la nouvelle valeur ---
fclose($file_handle);
echo $compteur;
?>