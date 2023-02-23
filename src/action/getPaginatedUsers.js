import express from "express";
const fetch = require("node-fetch");

const HASURA_OPERATION = `
query MyQuery($offset: Int = 0, $limit: Int = 10) {
  user(limit: $limit, offset: $offset) {
    id
    first_name
    last_name
    gender
  }
}
`;

// execute the parent operation in Hasura
const execute = async (variables) => {
  const fetchResponse = await fetch("http://localhost:8080/v1/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: HASURA_OPERATION,
      variables,
    }),
  });
  //   console.log(fetchResponse);
  const data = await fetchResponse.json();
  return data;
};

// Request Handler

const paginatedUsersRouter = express.Router();
paginatedUsersRouter.post("", async (req, res) => {
  // get request input

  const { offset, limit } = req.body.input;
  //   console.log(offset, limit);

  // run some business logic

  // execute the Hasura operation
  const { data, errors } = await execute({ offset, limit });

  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0]);
  }

  // success
  return res.json([...data.user]);
});

export { paginatedUsersRouter };
