**Falls euch meine Arbeit gefällt :** <br>

[![Paypal Donation](https://img.shields.io/badge/paypal-donate%20%7C%20spenden-blue.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PK89K4V2RBU78&source=url)


# ioBroker.LightOnOffPresence (Version 0.1.0)
Dieses Script ermöglicht es, eure Lampen über beliebig viele Bewegungsmelder, beliebig viele Taster und über vorhandene Datenpunkte zu Schalten und zu Dimmen.

## Was sollte beachtet werden und was ist möglich?
Der timeout beginnt erst dann zu laufen, wenn der Datenpunkt "motion" des jeweiligen Bewegungsmelders den Wert "false" zurückgibt. Sollten mehrere Bewegungsmelder eine Lampe schalten, wird gewartet bis alle BWM "false" melden. <br>
*Hinweis*: Die Einschaltdauer sollte nicht nur wenige Sekunden betragen, da einige Bewegungsmelder einen cooldown haben, bevor sie wieder Bewegungen erkennen und melden. Da führt dazu, dass eventuell Lampen bei zu kurzer Einschaltdauer ausschalten, obwohl man noch im Raum ist! <br>
Wird ein Lichtsensor verwendet, kann man ihn pro Bewegungsmelder zuordnen. Auch kann man die Einschaltdauer pro Lampe einzeln festlegen. Das Script ist modular aufgebaut, d.h. es kann jeder Bewegungsmelder mit jeder Lampe (auch mehreren) gekoppelt werden. Das gleiche gilt für Lichtsensoren. <br>


## Script-Updates einspielen
- Das Script ist so aufgebaut, dass Updates keinen Einfluss auf eure Geräteliste haben. Ihr müsst eure Geräte nur einmal anlegen und das wars dann auch schon. Die folgende Zeile gibt euch einen Hinweis darauf, ab wo ihr das Script bei einem Update kopieren und wieder einfügen müsst. <br>
  ![update_Zeile.png](/admin/update_Zeile.png)
 <br>


# Anleitung
## Script erstellen
Ein neues JS Script in iobroker erstellen und das Script aus "script-bwm-script.js" kopieren und einfügen. <br>

![erstellung_1.png](/admin/erstellung_1.png) <br>
![erstellung_2.png](/admin/erstellung_2.png) <br>

## Geräte anlegen

### Schaltaktor hinzufügen
1. Das Anlegen eines Schaltaktors ist sehr einfach. man benötigt nur den Pfad zum Schalten und einen Timer, wie lange die Lampe eingeschaltet bleiben soll. Für jede neue Lampe die erste **Zahl forlaufend** erhöhen!<br>

    ![arrLights.png](/admin/arrLights.png)

- **path**: Pfad zum Switch, der den Aktor schaltet
- **timer**: Einschaltdauer des Aktors in Sekunden

### Lichtsensor hinzufügen
1. Als nächstes kann man optional einen oder mehrere Lichtsensoren integrieren. Für jeden neuen Lichtsensor die erste **Zahl forlaufend** erhöhen! Wenn kein Lichtsensor vorhanden ist, einfach das vorhandene Objekt auskommentieren mit **//**<br>

    ![arrSensors.png](/admin/arrSensors.png) <br>
  Sensor vorhanden

    ![arrSensors_auskommentiert.png](/admin/arrSensors_auskommentiert.png) <br>
  Sensor auskommentiert

- **path**: Pfad zum Helligkeitswert den der Lichtsensor ausgibt
- **value**: Schwellwert der unterschritten werden muss, damit das Licht eingeschaltet wird

### Bewegungsmelder hinzufügen und alles verbinden
1. Für jeden Bewegungsmelder muss ein eigenes Objekt angelegt werden. Keine Angst, hört sich kompliziert an, ist aber kinderleicht. Dazu einfach die erste Zeile kopieren oder diese hier nehmen '{ bwm: 'hier den Pfad zum DP "motion" einfuegen', lights: [], sensors: [] },' (ohne '')<br>

    ![arrDevices.png](/admin/arrDevices.png)

- **bwm**: Pfad zum Datenpunkt des Bewegungsmelders, der den **Motion Wert** zurückgibt (bspw occupancy)
- **lights**: in die eckigen Klammern die im ersten Schritt angelegten Schaltaktoren eingeben (nur die Zahlen der Aktoren, die vom jeweiligen Bewegungsmelder auch geschaltet werden sollen)
- **sensors**: in die eckigen Klammern die im zweiten Schritt angelegten Lichtsensoren eingeben (nur die Zahlen der Lichtsensoren, die vom jeweiligen Bewegungsmelder auch beachtet werden sollen). Sollte kein Lichtsensor vorhanden sein, einfach die Klammern leerlassen.

Das wars dann auch schon. Nur noch speichern und das Script starten

Viel Spaß dabei 




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


# License
MIT License

Copyright (c) 2021 schmakus<br>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:<br>

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.<br>

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.<br>
