# bike_simulator
Bike simulator for testing the whole system in the VTEAM course at BTH.

## Översikt
Bike simulator är en simulator som vi kommer använda för att testa och validera vårat system för elsparkcykeluthyrning. Denna simulator kan simulera cyklar och användare som ska interagre med systemet i realtid via vårt restAPI. Vi vill med denna simulering kunna testa systemet under belastning, och därmed säkerställa att alla komponenter fungerar som de ska innan leverans.

## Funktioner
- GeoJSON: Vi använder GeoJSON för att hantera och visualisera den geografiska informationen.
- Realtidsuppdateringar: Vi ska använda Socket.IO för att simulera sparkcyklarnas positioner och status, alltihopa i realtid.
- Simulering: Vi simulerar 1000-tals sparkcyklar som uppdaterar positioner samt status via vårt API.
- Belastningstester: Vi ska generera flera scenarier som testar hög belastning.

## Teknologier
- Node.js
- Axios
- Socket.IO
- GeoJSON

## Installation
Steg för att installera och köra simulatorn lokalt:

Klona detta repository
```bash
git clone https://github.com/ditt-användarnamn/bike_simulator.git
cd bike_simulator
```
Installera beroenden
```bash
npm install
```

Konfigurera miljövariabler (om du inte vill simulera genom docker)
```bash
Skapa .env-fil i rotmapp
API_URL=http://localhost:5001
SIMULATION_SPEED=fast
NUMBER_OF_BIKES=1000
UPDATE_INTERVAL=5
```
Starta simulatorn
```bash
utan Docker:
npm start

med Docker:
docker-compose up
```

## API:et
Se till att restAPI:et är igång och tillgängligt.

## Testa och validera simuleringen
- Simulering av cyklar i en stad.
- Belastningstest.
- Test av extra avgifter.

## Användning med Docker Compose
Starta simulatorn tillsammans med backend, frontend (webb-app) och mobile-app i docker-compose som hittas i VTEAM-repot.

### Bygg och pusha Docker-image
Bygg Docker-image:
```bash
docker build -t ditt-användarnamn/bike-simulator:version .

Logga in:
docker login

Pusha:
docker push ditt-användarnamn/bike-simulator:version
