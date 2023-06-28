const axios = require('axios');

const host = 'https://rebrickable.com';

exports.get = async (setId) => {
  const response = await axios.get(`${host}/api/v3/lego/sets/${setId}-1/`, {
    headers: {
      Authorization: `key ${process.env.REBRICKABLE_API_KEY}`,
    },
  });

  return response.data;
};

exports.getWithMinifigs = async (setId) => {
  const set = await axios.get(`${host}/api/v3/lego/sets/${setId}-1/`, {
    headers: {
      Authorization: `key ${process.env.REBRICKABLE_API_KEY}`,
    },
  });

  const figs = await axios.get(
    `${host}/api/v3/lego/sets/${setId}-1/minifigs/`,
    {
      headers: {
        Authorization: `key ${process.env.REBRICKABLE_API_KEY}`,
      },
    }
  );

  return { ...set.data, ...figs.data };
};
