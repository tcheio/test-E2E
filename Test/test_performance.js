import http from 'k6/http';
import { sleep, check } from 'k6';

// Paramètres du test
export let options = {
    stages: [
        { duration: '10s', target: 500 }, // Monter à 500 utilisateurs en 10s
        { duration: '30s', target: 500 }, // Maintien à 500 utilisateurs pendant 30s
        { duration: '10s', target: 0 },   // Descente à 0 utilisateur
    ],
};

export default function () {
    let payload = JSON.stringify({
        name: `Test`,
        email: "test@mail.com",
        $deadline: Date.now()
    });

    let headers = { 'Content-Type': 'application/json' };

    let res = http.post('http://localhost:9090/api/', payload, { headers });

    // Vérification des réponses
    check(res, {
        'Statut 200 attendu': (r) => r.status === 200,
        'Réponse rapide': (r) => r.timings.duration < 500,
    });

    sleep(1); // Pause de 1 seconde entre chaque requête
}
