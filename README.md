# Progetto TechWeb: WikiBlank

**Studente:** Alessia Marsco
**Matricola:** N86004600
**Traccia Scelta:** 4.B WEBTECH’S WIKIBLANK

## Descrizione
Questo progetto è composto da un backend in **Node.js/Express** con database **SQLite** e un frontend sviluppato in **Angular**. 

Di seguito sono riportate le istruzioni dettagliate per installare le dipendenze e avviare correttamente entrambi gli ambienti sul proprio computer locale.

---

## 🛠️ Prerequisiti di Sistema
Assicurarsi di avere installato sul proprio computer:
* **Node.js** (versione consigliata: 18.x o superiore)
* **npm** (incluso con Node.js)

---

## ⚙️ 1. Avvio del Back-end

Il backend utilizza SQLite, quindi il database verrà generato automaticamente al primo avvio.

1. Aprire il terminale e navigare nella cartella del backend:
   ```bash
   cd wikiblank-backend
   ```
2. Installare tutte le dipendenze necessarie:
   ```bash
   npm install
   ```
3. Avviare il server:
   ```bash
   npm start
   ```
> **Nota:** Il server backend sarà in ascolto all'indirizzo `http://localhost:3000`. Non chiudere questo terminale.

---

## 💻 2. Avvio del Front-end

Aprire un **nuovo** terminale (lasciando in esecuzione quello del backend) e seguire questi passaggi:

1. Navigare nella cartella del frontend:
   ```bash
   cd wikiblank-frontend
   ```
2. Installare tutte le dipendenze necessarie:
   ```bash
   npm install
   ```
3. Avviare l'applicazione Angular:
   ```bash
   npm start
   ```
   *(oppure `ng serve` se si ha Angular CLI installato globalmente)*

> **Nota:** L'applicazione frontend sarà accessibile dal browser all'indirizzo `http://localhost:4200`.

---