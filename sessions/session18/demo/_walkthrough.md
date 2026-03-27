# Guio De Classe: Demo De Realtime Amb Socket.IO

## Objectiu De La Sessio

En aquesta classe volem ensenyar comunicació en temps real entre client i servidor.

El cas d'us triat es `raise hand`:

- el client envia un event
- el servidor el valida i actualitza un estat compartit
- el servidor redistribueix el canvi a tots els clients connectats

Això ens permet explicar:

- quan té sentit fer servir sockets
- diferencia entre HTTP i realtime
- com modelar events
- com mantenir un estat compartit temporal

## Per Què Aquest Exemple

No fem servir `chat` perque seria massa evident i els alumnes ja veurien massa clar cap on han d'anar després a la pràctica.

`Raise hand` funciona be perquè:

- és un event efimer
- té sentit que sigui immediat
- no cal persistir-lo a base de dades
- obliga a pensar en estat compartit i broadcast

## Resultat Final Que Han D'Entendre

Quan un client prem `Raise hand`:

1. El frontend envia `hand.raise` per Socket.IO.
2. El backend rep aquest event.
3. El backend valida `userId` i `name`.
4. El backend actualitza l'estat de mans alzades en memòria.
5. El backend emet `hand.updated` a tots els clients.
6. Tots els frontends actualitzen la UI.

Quan un client prem `Lower hand`:

1. El frontend envia `hand.lower`.
2. El backend elimina aquella mà de l'estat compartit.
3. El backend torna a emetre `hand.updated`.

Quan un client nou entra:

1. Es connecta al servidor Socket.IO.
2. El servidor li envia `hand.snapshot`.
3. El client pinta l'estat actual.

## Diferencia Amb HTTP

Punt clau per explicar:

- HTTP: el client demana alguna cosa i el servidor respon
- Socket.IO/WebSocket: la connexió queda oberta i qualsevol costat pot enviar events en qualsevol moment

Pregunta per classe:

"Per què aquí no fem un `POST /hands/raise`?"

Resposta esperada:

- es podria fer
- però el valor del realtime és que el canvi es propaga immediatament als altres clients
- el problema no és només crear una dada, sinò sincronitzar estat viu

## Peces Del Codi

### 1. Model Del Domini

Fitxer: [backend/src/interfaces/hand.interface.ts](../backend/src/interfaces/hand.interface.ts)

Aqui definim l'objecte principal:

- `RaisedHand`
- `RaiseHandInput`
- `LowerHandInput`

Idea per remarcar:

- encara que no hi hagi BBDD, segueix sent útil definir el contracte de dades

### 2. Servei Amb Estat Temporal

Fitxer: [backend/src/services/hand.service.ts](../backend/src/services/hand.service.ts)

Aquest fitxer és important perquè separa la lògica del domini de la capa de transport.

Responsabilitats:

- mantenir l'estat efímer en un array
- validar dades
- actualitzar l'estat
- retornar l'objecte final

Punts per explicar:

- no es guarda a base de dades
- l'estat viu nomes mentre el servidor esta encès
- si es reinicia el backend, tot desapareix

Missatge docent important:

"No tot s'ha de persistir. Hi ha estat temporal de sessió o de presencia que pot viure nomes en memòria."

### 3. Gateway De Realtime

Fitxer: [backend/src/realtime/hand.gateway.ts](../backend/src/realtime/hand.gateway.ts)

Aquesta és la capa que connecta Socket.IO amb la lògica del servei.

Responsabilitats:

- escoltar connexions noves
- enviar `hand.snapshot` quan entra un client
- escoltar `hand.raise`
- escoltar `hand.lower`
- emetre `hand.updated`
- retornar errors al client si alguna dada no es valida

Idea clau:

- el gateway no hauria de contenir tota la lògica
- el gateway tradueix events de socket a crides al servei

Pregunta per classe:

"Per què no posem tota la lògica directament dins del `socket.on(...)`?"

Resposta:

- per separar transport i negoci
- perquè després puguis reaprofitar la lògica
- per mantenir el codi més net i testeable

### 4. Arrencada Del Servidor

Fitxer: [backend/src/server.ts](../backend/src/server.ts)

Aqui fem dues coses:

- crear el servidor HTTP
- attachar el gateway Socket.IO a aquest servidor

Idea important:

- Express continua existint
- Socket.IO no substitueix Express
- conviuen al mateix servidor

### 5. Client Del Frontend

Fitxer: [frontend/app/components/hand-demo.tsx](../frontend/app/components/hand-demo.tsx)

El frontend:

- obre la connexio
- escolta events
- envia `hand.raise`
- envia `hand.lower`
- actualitza la llista local

Punts importants:

- `hand.snapshot` carrega l'estat inicial
- `hand.updated` manté el client sincronitzat
- el client no decideix l'estat final, nomes envia la intencio

Missatge docent important:

"El client envia una intencio. El servidor decideix l'estat compartit."

## Protocol D'Events

### Client A Servidor

```json
{ "type": "hand.raise", "payload": { "userId": "student-01", "name": "Oriol" } }
```

```json
{ "type": "hand.lower", "payload": { "userId": "student-01" } }
```

En la implementacio actual amb Socket.IO, aquests surten com:

- `socket.emit("hand.raise", { userId, name })`
- `socket.emit("hand.lower", { userId })`

### Servidor A Client

Snapshot inicial:

```json
[
  {
    "userId": "student-01",
    "name": "Oriol",
    "raised": true,
    "updatedAt": "2025-10-20T10:00:00.000Z"
  }
]
```

Update:

```json
{
  "userId": "student-01",
  "name": "Oriol",
  "raised": true,
  "updatedAt": "2025-10-20T10:00:00.000Z"
}
```

## Ordre Recomanat De La Classe

### Bloc 1. Motivacio

Temps orientatiu: 5-10 min

Explicar:

- quin problema resol HTTP
- quin problema resol realtime
- perque `raise hand` te sentit com a demo

Pregunta a classe:

"En quins casos d'us reals te sentit temps real?"

Esperar coses com:

- xat
- notificacions en viu
- presence
- typing indicators
- dashboards

### Bloc 2. Mirar El Frontend

Temps orientatiu: 10 min

Comencaria pel frontend perque es visual.

Mostrar:

- on es crea la connexio
- quins events escolta
- que passa en fer clic a `Raise hand`

Preguntes:

- "Que envia realment el client?"
- "El client envia l'objecte final o nomes les dades minimes?"

Resposta:

- envia nomes la intencio i el payload necessari

### Bloc 3. Mirar El Gateway

Temps orientatiu: 10-15 min

Mostrar:

- `connection`
- `socket.on("hand.raise")`
- `socket.on("hand.lower")`
- `socket.emit("hand.snapshot")`
- broadcast de `hand.updated`

Punt clau:

- hi ha una diferencia entre enviar a un client concret i enviar a tots

Pregunta:

"Quina diferencia hi ha entre `socket.emit(...)` i `io.emit(...)`?"

Resposta:

- `socket.emit(...)`: nomes al client actual
- `io.emit(...)`: a tots els clients connectats

### Bloc 4. Mirar El Servei

Temps orientatiu: 10 min

Mostrar:

- array `raisedHands`
- `raise()`
- `lower()`
- `getAll()`

Punts a remarcar:

- estat temporal
- validacio
- no hi ha base de dades
- si entra el mateix `userId`, se substitueix la ma anterior

Pregunta:

"Aquest estat hauria d'anar a base de dades?"

Resposta esperada:

- en aquesta demo, no
- es presencia temporal
- en una app real dependria del problema

### Bloc 5. Connectar-ho Tot

Temps orientatiu: 5 min

Fer el recorregut complet:

1. clic al frontend
2. event pel socket
3. gateway
4. servei
5. broadcast
6. UI actualitzada

Si pots, obre dues pestanyes i ensenya l'efecte en viu.

## Preguntes Per Fer Pensar Als Alumnes

- Que passa si dos clients fan `raise hand` al mateix temps?
- Que passa si un client es desconnecta sense fer `lower hand`?
- Hauriem de netejar l'estat quan un socket es desconnecta?
- Com distingiriem diferents sales o aules?
- Com passariem d'aqui a un sistema de xat?
- Que val la pena persistir i que no?

## Extensions Bones Per Despres

Sense implementar-les a classe, pots deixar aquests reptes:

- afegir sales (`room.join`)
- associar cada socket a un usuari
- netejar la ma alzada en `disconnect`
- afegir un endpoint HTTP que retorni l'estat actual
- limitar qui pot alçar la ma
- transformar l'exemple en missatges o presence

## Missatges Clau Que Han De Quedar

- Socket.IO no substitueix HTTP; conviuen
- el client envia intencions, no l'estat global
- el servidor controla l'estat compartit
- no tot estat s'ha de persistir
- realtime te sentit quan el valor es la sincronitzacio immediata

## Tancament De La Classe

Frase de tancament suggerida:

"Amb aquesta demo no hem fet un xat, pero ja tenim gairebe totes les peces conceptuals: connexio persistent, events, estat compartit, broadcast i separacio entre client, gateway i logica de negoci."
