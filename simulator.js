const express = require('express');
const {initTrips, updateTrip} = require('./simulationModules/trips')
const app = express();
const port = 4000;

app.use(express.json());
app.post('/add-trips', async (req, res) => {
  const { city, trips: tripsCount } = req.body;
  if (!city || !tripsCount) {
    return res.status(400).send("Stad och antal resor");
  }

  console.log(`La till ${tripsCount} resor för ${city}...`);
  await initTrips(city, tripsCount);
  res.status(200).send(`La till ${tripsCount} resor.`);
});

app.listen(port, () => {
  console.log(`Simulation server running http://localhost:${port}`);
});

setInterval(updateTrip, 1000 + Math.random() * 500);
