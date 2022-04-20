const { admin, db } = require("../util/admin")
const { reduceClientDetails } = require("../util/validators")

exports.getAllClients = (req, res) => {
  db.collection("clients")
    .orderBy("lastName")
    .get()
    .then(data => {
      let clients = []
      data.forEach(doc => {
        clients.push({
          clientId: doc.id,
          ...doc.data()
        })
      })
      return res.json(clients)
    })
    .catch(err => console.error(err))
}


exports.createClient = (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Method not allowed" })
  }

  const newClient = {
    admin: false,
    macrosClientReady: false,
    activityLevel: req.body.activityLevel,
    age: req.body.age,
    carbCycling: req.body.carbCycling,
    carbCyclingMacros: {
      highCarbDay: {
        calories: req.body.carbCyclingMacros.highCarbDay.calories,
        carbs: req.body.carbCyclingMacros.highCarbDay.carbs,
        protein: req.body.carbCyclingMacros.highCarbDay.protein,
        fat: req.body.carbCyclingMacros.highCarbDay.fat
      },
      lowCarbDay: {
        calories: req.body.carbCyclingMacros.lowCarbDay.calories,
        carbs: req.body.carbCyclingMacros.lowCarbDay.carbs,
        protein: req.body.carbCyclingMacros.lowCarbDay.protein,
        fat: req.body.carbCyclingMacros.lowCarbDay.fat
      }
    },
    customMacroPlan: {
      calories: req.body.customMacroPlan.calories,
      carbs: req.body.customMacroPlan.carbs,
      fat: req.body.customMacroPlan.fat,
      protein: req.body.customMacroPlan.protein
    },
    firstName: req.body.firstName,
    gender: req.body.gender,
    inches: req.body.inches,
    lastName: req.body.lastName,
    startingWeight: req.body.startingWeight,
    tdee: req.body.tdee,
    weight: req.body.weight
  }
  db.collection("clients")
    .add(newClient)
    .then(doc => {
      const resClient = newClient
      resClient.clientId = doc.id
      res.json(resClient)
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: "Something went wrong" })
    })
}

exports.updateClient = (req, res) => {
  let clientDetails = reduceClientDetails(req.body)
  console.log({ req })
  console.log({ res })

  db.doc(`clients/${req.params.clientId}`)
    .update(clientDetails)
    .then(() => {
      console.log({ res })
      return res.json({ message: "Client updated successfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ err: error.code });
    });
};


exports.getClient = (req, res) => {
  let clientData = {};
  db.doc(`/clients/${req.params.clientId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Client not found" });
      }
      clientData = doc.data();
      clientData.clientId = doc.id;
      const checkinPromise = () =>
        new Promise(resolve =>
          setTimeout(
            resolve,
            0001,
            db
              .collection("checkins")
              .orderBy("createdAt", "asc")
              .where("clientId", "==", req.params.clientId)
              .get()
          )
        );

      Promise.resolve()
        .then(() => {
          const checkinProm = checkinPromise();
          return Promise.all([checkinProm]);
        })
        .then(([checkins]) => {
          clientData.checkins = [];
          checkins.forEach(doc => {
            clientData.checkins.push(doc.data());
          });
          return res.json(clientData);
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: "Something went wrong" });
        });

      //return res.json(clientData)
    });
};

exports.checkinOnClient = (req, res) => {
  //if (req.body.weight.trim() === "")
  // return res.status(400).json({ checkin: "Checkin must not be empty" });
  const newCheckin = {
    vibes: req.body.vibes,
    weight: req.body.weight,
    createdAt: new Date().toISOString(),
    clientId: req.params.clientId,
    checkinCount: 0
  };

  db.doc(`clients/${req.params.clientId}`)
    .get()
    .then(doc => {
      if (!doc.exists) return res.status(404).json({ error: "Client not found" });
      return doc.ref.update({ checkinCount: doc.data().checkinCount + 1 });
    })
    .then(() => {
      return db.collection("checkins").add(newCheckin);
    })
    .then(() => {
      res.json(newCheckin);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

exports.deleteClient = (req, res) => {
  const docToBeDel = db.doc(`/clients/${req.params.clientId}`);
  docToBeDel
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Client not found" });
      }
      // if (doc.data().userHandle !== req.user.handle) {
      //   return res.status(403).json({ error: "Unauthorized" });
      // } else {
      return docToBeDel.delete();
      // }
    })
    .then(() => {
      res.json({ message: "Client deleted successfully" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};