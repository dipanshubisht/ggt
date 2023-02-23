import express from "express";
const fetch = require("node-fetch");

const HASURA_OPERATION_GET_ALL_USERS_IN_RANGE = `query rangeQuery($lteLong: Int = 100, $gteLong: Int = 0, $gteLat: Int = 0, $lteLat: Int = 100) {
  user_tracking(limit: 100, where: {long: {_gte: $gteLong, _lte: $lteLong}, _and: {lat: {_gte: $gteLat, _lte: $lteLat}}}) {
    lat
    long
    user_id
  }
  user {
    last_name
    gender
    first_name
    id
  }
}`;

function isInside(circle_x, circle_y, rad, x, y) {
  if (
    (x - circle_x) * (x - circle_x) + (y - circle_y) * (y - circle_y) <=
    rad * rad
  )
    return true;
  else return false;
}

const execute = async (variables) => {
  try {
    const fetchResponse = await fetch("http://localhost:8080/v1/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: HASURA_OPERATION_GET_ALL_USERS_IN_RANGE,
        variables,
      }),
    });
    let data = await fetchResponse.json();

    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getUsersByRadiusRouter = express.Router();
getUsersByRadiusRouter.post("", async (req, res) => {
  // get request input
  const { lat = 0, long = 0, radius = 20 } = req.body.input;
  console.log(lat, long, radius);

  // run some business logic
  const variables = {
    gteLat: parseInt(lat) - radius,
    gteLong: parseInt(long) - radius,
    lteLat: parseInt(parseInt(lat) + radius),
    lteLong: parseInt(parseInt(long) + radius),
  };
  const { data, errors2 } = await execute(variables);
  const radiusData =
    data.user_tracking && data.user_tracking.length > 0
      ? data.user_tracking.filter((x) =>
          isInside(lat, long, radius, x.lat, x.long)
        )
      : [];

  const finalResponse = [];
  radiusData.forEach((element) => {
    const tempObject = {
      ...data.user.find((x) => x.id === element.user_id),
      location: {
        lat: element.lat,
        long: element.long,
      },
    };
    finalResponse.push(tempObject);
  });

  /*
  // In case of errors:
  return res.status(400).json({
    message: "error happened"
  })
  */

  // success
  return res.json(finalResponse);
});

export { getUsersByRadiusRouter };
