export async function insertStats(
  token,
  { favourited, userId, videoId, watched }
) {
  const operationsDoc = `
  mutation insertStats($favourited: Int!, $userId: String!, 
    $videoId: String!, $watched: Boolean! )
  {
    insert_stats_one(object: { 
      userId: $userId,
       videoId: $videoId, 
       watched: $watched, 
       favourited: $favourited
      }) {
      favourited
      id
      userId
      videoId
      watched
    }
  }
`;

  return await queryHasuraGQL(
    operationsDoc,
    "insertStats",
    { favourited, userId, videoId, watched },
    token
  );
}

export async function updateStats(
  token,
  { favourited, userId, videoId, watched }
) {
  const operationsDoc = `
  mutation updateStats($favourited: Int!, $userId: String!,$videoId: String!, $watched: Boolean! ) {
    update_stats(
      _set: {favourited: $favourited, watched: $watched}, 
      where: {
        userId: {_eq: $userId},
        videoId: {_eq: $videoId}}) {
      returning {
        favourited,
        watched,
        userId,
        videoId
      }
    }
  }
`;

  return await queryHasuraGQL(
    operationsDoc,
    "updateStats",
    { favourited, userId, videoId, watched },
    token
  );
}

export async function findVideoIdByUser(token, userId, videoId) {
  const operationsDoc = `
  query findVideoIdByUserId($userId: String!, $videoId: String!) {
    stats(where: {_and: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}}) {
      id
      userId
      videoId
      watched
      favourited
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "findVideoIdByUserId",
    { userId, videoId },
    token
  );

  return response?.data?.stats;
}

export async function createNewUser(token, metadata) {
  const operationsDoc = `
  mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
      }
    }
  }
`;

  const { issuer, email, publicAddress } = metadata;

  const response = await queryHasuraGQL(
    operationsDoc,
    "createNewUser",
    { issuer, email, publicAddress },
    token
  );

  return response;
}

export async function isNewUser(token, issuer) {
  const operationsDoc = `
  query isNewUser($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      email
      id
      issuer
    }
  }
`;

  const resp = await queryHasuraGQL(
    operationsDoc,
    "isNewUser",
    { issuer },
    token
  );

  return resp?.data?.users?.length === 0;
}

export async function queryHasuraGQL(
  operationsDoc,
  operationName = "My Query",
  variables,
  token
) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: "POST",
    headers: {
      // "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

export async function getWatchedVideos(userId, token) {
  const operationsDoc = `
  query watchdedVideos( $userId: String!) {
    stats(where: {watched: {_eq: true}, userId: {_eq: $userId}}) {
      videoId
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "watchdedVideos",
    { userId },
    token
  );

  return response?.data?.stats;
}

export async function getMyListVideos(userId, token) {
  const operationsDoc = `
  query favouritedVideos($userId: String!) {
    stats(where: {
      userId: {_eq: $userId}, 
      favourited: {_eq: 1}
    }) {
      videoId
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "favouritedVideos",
    {
      userId,
    },
    token
  );

  return response?.data?.stats;
}
