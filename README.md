**Falls euch meine Arbeit gefällt :** <br>

[![Paypal Donation](https://img.shields.io/badge/paypal-donate%20%7C%20spenden-blue.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PK89K4V2RBU78&source=url)


# ioBroker.LightOnOffPresence (Version 0.1.0)
Dieses Script ermöglicht es, eure Lampen über beliebig viele Bewegungsmelder (BWM, beliebig viele Taster und über vorhandene Datenpunkte zu Schalten und zu Dimmen.

## Information
Das Script ist aktuell auf Homematic Taster und x-beliebige BWM ausgelegt und getestet.Es befindet sich noch im Beta Status und kann fehler enthalten. Bei Fehlfunktionen einfach ein Issue aufmachen.

## Inhalt
<!-- TABLE OF CONTENTS -->
  <summary>Inhalt</summary>
  <ol>
    <li><a href="#features">Features</a></li>
    <li>
      <a href="#anleitung">Anleitung</a>
       <ul>
        <li><a href="#Script-erstellen">Script anlegen/installieren</a></li>
         <li><a href="#Allgmeines">Allgemeine Werte</a></li>
        <li><a href="#Gruppe-definieren">Gruppen anlegen</a></li>
        <li><a href="#Lampen-definieren">Lampen anlegen</a></li>
        <li><a href="#Zeitplaene-definieren">Zeitpläne anlegen</a></li>
         <li><a href="#Beschreibung-Datenpunkte">Übersicht der Datenpunkte</a></li>
      </ul>
    </li>
    <li><a href="#zukuenftige-planungen">Planungen / Ideen</a></li>
    <li><a href="https://github.com/Schmakus/ioBroker.LightOnOffPresence/wiki/FAQ">FAQ</a></li>
    <li><a href="#greetings">Schlusswort</a></li>
    <li><a href="#changelog">Changelog</a></li>
    <li><a href="#license">License</a></li>
  </ol>




<!-- FEATURES -->
## Features
### Licht schalten per Taster
* Licht ein und aus per Taster, welcher ein "true" liefert (Aktuell getestet mit Homematic IP)
* Individuell für jede Gruppe kann bei Licht ein gewählt werden, ob die Helligkeit auf einen Standard-Wert oder ob die Helligkeit nach Zeitplan-Definition gesetz wird.
* Individuell für jede Gruppe kann festgelegt werden, ob ein vorhandener BWM beim Schalten mit Taster außer Kraft gesetzt wird (Putzlicht)
* Individuell für jede Gruppe kann festgelegt werden, ob eine "Sicherheitsabschaltung" nach Zeit X erfolgen soll (Standard 3600s)
* Wenn eine Sicherheitsabschaltung festgelegt wurde, dann wird dies bei Bewegung immer zurückgesetzt

### Licht schalten per BWM
* Das Licht wird bei Bewegung eingeschaltet. Dabei spielt es keine Rolle, welcher BWM der Gruppe ausgelöst hat
* Das Licht wird nach Zeit X (Individuell pro Gruppe einstellbar) ausgeschaltet, wenn alle BWM auf "false" sind
* Der timeout beginnt erst dann zu laufen, wenn alle BWM den Wert "false" stehen.
* Bei Bewegung wird das Licht in Abhängigkeit des Zeitplans geschaltet. (z.B.: Helligkeit)
* Bei Bewegung wird das Licht in Abhängikeit des Lux-Wertes geschaltet (sofern vorhanden)

*Hinweis*: Die Einschaltdauer sollte nicht nur wenige Sekunden betragen, da einige Bewegungsmelder einen cooldown haben, bevor sie wieder Bewegungen erkennen und melden. Da führt dazu, dass eventuell Lampen bei zu kurzer Einschaltdauer ausschalten, obwohl man noch im Raum ist! <br>

### Licht dimmen per Taster
* Das Licht kann hoch- und runtergedimmt werden. Dies erfolgt aktuell nur durch ein "true" welches durch das vorgegebene Intervall eines Homematic Tasters gesetzt wird
* Gedimmt werden kann nur, wenn vorher das Licht eingeschaltet wurde (per Taster oder BWM, wobei ein BWM die Helligkeit wieder nach Zeitplan setzen würde)

### Notlicht
* Es gibt einen gemeinsamen Datenpunkt "Notlicht". (z.B. in Verbindung mit Rauchmeldern oder Sonstiges)
* Über diesen Datenpunkt werden alle zugeordneten Lampen auf eine fest eingestellte Helligkeit oder einfach nur ein geschaltet.
* Die Notlichtfunktion merkt sich zuvor den aktuellen Status der Lampe. Bei deaktivieren des Notlichts, werden die Lampen auf den zuvor eingestellten Wert gesetzt.

### Datenpunkte
* Alle Lampen können zentral gesteuert werden (Default-Werte oder nach Zeitplan)
* Alle Lampen einer Gruppe können gesteuet werden (Default-Werte oder nach Zeitplan)
* Der Lampenstatus jeder Gruppe wird per Datenpunkt angezeigt
* Der Status jeder Lampe wird per Datenpunkt angezeigt

## Script-Updates einspielen
* Das Script ist so aufgebaut, dass Updates keinen Einfluss auf eure Geräteliste haben (Zumindest nicht bei kleinen Updates ;-)). Ihr müsst eure Geräte nur einmal anlegen und das wars dann auch schon. Die folgende Zeile gibt euch einen Hinweis darauf, ab wo ihr das Script bei einem Update kopieren und wieder einfügen müsst. <br>
  ![Ab_hier_nichts_mehr_aendern.png](/admin/Ab_hier_nichts_mehr_aendern.png)
 <br>

<!-- ANLEITUNG -->
# Anleitung

<!-- INSTALLATION -->
## Script erstellen
Ein neues JS Script in iobroker erstellen und das Script aus "script-bwm-script.js" kopieren und einfügen. <br>

![erstellung_1.png](/admin/erstellung_1.png) <br>
![erstellung_2.png](/admin/erstellung_2.png) <br>

<!-- DEFAULT -->
### Allgmeines
Allgemein gültige Wete für das gesamte Script

  ![Allgemeine_Werte_definieren.png](/admin/Allgemeine_Werte_definieren.png)

* **defaultTransition**: TrasitionTime (sollte aufgrund des Dimmens nicht kleiner als **0.8** sein
* **DimIntervall**: Schritte fürs dimmen (bei Level von 0-100 sind 10er Schritte ideal)
* **luxThreshold**: Helligkeits-Wert der Lichtsensoren, ab wann das Licht geschaltet werden soll
* **statesPath**: Ort, wo die Datenpunkte agelegt werden sollen
* **logging**: Einfaches Logging
* **extLogging**: Erweitertes Logging


<!-- GRUPPEN -->
### Gruppe definieren
Das Anlegen einer Gruppe ist sehr einfach.

* Man benötigt nur die Pfade der Taster, BMWs und Lichtsensor.
* Definieren der Timer und Sperren.
* Zuordnen aller Lampen über die Lampennummer (nächster Punkt: Lampen definieren)
* In allen eckigen Klammern können mehrere Datenpunkte oder Werte definiert werden. Wichtig hierbei ist die Trennung durch ein Komma
* Alle Werte sind in folgendem Screenshot beschrieben:

    ![Gruppen_definieren.png](/admin/Gruppen_definieren.png)

<!-- LAMPEN -->
### Lampen definieren
2. Für jede Lampe die erste **Zahl forlaufend** erhöhen! (Es können natürlich auch Lampengruppen wie z.B. vom Deconz Adapter verwendet werden werden)
* Alle Werte sind in folgendem Screenshot beschrieben:

    ![Lampen_definieren.png](/admin/Lampen_definieren.png) <br>
 

<!-- SCHEDULES -->
### Zeitplaene definieren
3. Es können beliebig viele Zeitpläne erstellt werden. Für jeden Zeitplan die erste **Zahl forlaufend** erhöhen!
**Hinweis** Wenn mehrere Zeitpläne einer Lampe zugeordnet werden, sollten sich die Zeiten nicht überschneiden! Dies führt zur Fehlfunktion des Scripts!

* Für jeden Zeitplan wird ein automatischer Schedule angelegt, welcher zur Startzeit die Werte **brighness** (nur wenn Licht an ist), **colorTemp** und **color** ändert. 

    ![Zeitpläne_definieren.png](/admin/Zeitpläne_definieren.png)

- **from**: Startzeit (wird ebenfalls für den automatischen Scheduler verwendet)
- **to**: Endzeit
- **days**: 1: Mo // 1-2: Mo-Di // 2-3: Di-Mi // 1-4: Mo // 1-7: Mo-So // usw.
- **brighness**: Helligkeit der Lampe (Sofern der Datenpunkt **pathControll** der Gruppe des Typs **number** entspricht)
- **colorTemp**: Farbtemperatur, sofern in der Gruppe ein Datenpunkt definiert wurde
- **color**: Farbe, sofern in der Gruppe ein Datenpunkt definiert wurde (Angabe als Hex-Wert: z.B. **#0000FF** oder als xy-Wert: z.B. **100, 100**
- **state**: true/false = Ein/Aus (Sofern der Datenpunkt **pathControll** der Gruppe des Typs **boolean** entspricht)
- **name**: Freier Text zur einfacheren Unterscheidung. Keine Funktion innerhalb des Scripts, nur beim logging

## Beschreibung Datenpunkte

  ![Datenpunkte.png](/admin/Datenpunkte.png)

## Zukuenftige Planungen
* Schalten des Lichts mit nur einem einzelnen Taster
* Schalten und Dimmen des Lichts mit unterschiedlichen Tastertypen. z.B. Aquara welche einen Zahlenwert auswerfen
* Astrozeiten in den Zeitplänen
* Individuelle Brighness-Werte von Lampen (z.B. anstatt 0-100 => 0-256)
* Ansteuerung der Farben, wenn mehrere Datenpunkte beschrieben werden müssen (HSL, HS,...)

## Greetings
Vielen Dank an Carlo Pittini und Stefan Feldkamp für die Inspiration für diese Script. Ich habe mich bei beiden ewtas beim Coding abgeschaut. ;-)

Das wars dann auch schon. Nur noch speichern und das Script starten

Viel Spaß dabei 


<!-- CHANGELOG -->
## Changelog

### 0.1.0 (2021-03-16)
* (schmakus) Release der ersten Beta
* (schmakus) Umsetzung der Änderung von Farbtemperatur, Farbe und Helligkeit durch automatische Zeitpläne

### 0.0.3 (2021-01-20)
* (schmakus) bugfixes

### 0.0.2 (2020-12-31)
* (schmakus) zahlreiche Änderungen nach ersten Tests

### 0.0.1 (2020-12-15)
* (schmakus) initial commit

<!-- LICENSE -->
# License
MIT License

Copyright (c) 2021 schmakus<br>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:<br>

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.<br>

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.<br>
