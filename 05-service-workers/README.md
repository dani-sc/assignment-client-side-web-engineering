# Important Notes

Website copied from https://github.com/jpeer264/jpeer.at/tree/test/clientside

Gute Anleitung auf [developers.google.com](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers) zu finden, welche für diese Aufgabe befolgt wurde.

---

# Usage
```sh
$ npm i -g gulp-cli
$ yarn
$ gulp serve
```

Service worker ist in `src/assets/js/app.js` ganz unten definiert.

`sw.js` ist in `src/sw.js`

# Ergebnisse

## Ohne Service-Workers

SW ... Service-Workers

Alle Zeitangaben in Sekunden

|                         |                    | 1  | 2  | 3  | 4  | 5  | avg   |
|------------------------:|--------------------|---:|---:|---:|---:|---:|------:|
| **-------------------** | *DOMContentLoaded* |2.01|2.54|2.27|2.61|2.46| `2.38` |
| **ohne Cache**          | *Load*             |2.59|2.83|2.69|3.07|2.68| **2.78** |
| **-------------------** | *Finish*           |2.64|3.08|2.89|3.29|3.04| **2.99** |
| **-------------------** | *DOMContentLoaded* |0.89|1.42|1.23|0.85|1.32| `1.14` |
| **mit Cache, ohne SW**  | *Load*             |0.96|1.5 |1.38|0.9 |1.39| **1.23** |
| **-------------------** | *Finish*           |1.99|2.41|2.34|1.84|2.32| **2.18** |
| **-------------------** | *DOMContentLoaded* |0.71|0.82|1.16|0.8 |1.17| `0.93` |
| **mit SW**              | *Load*             |1.03|1.08|1.51|1.07|1.45| **1.23** |
| **-------------------** | *Finish*           |2.07|2.07|2.52|2.08|2.46| **2.24** |

Mit Service-Workers ist die Seite auch vollständig benutzbar, wenn man offline ist. Nur ein paar Sachen, wie google analytics, können aber nicht geladen werden (was wohl auch die Ergebnis-Tabelle oben ein wenig beeinflusst hat.)

