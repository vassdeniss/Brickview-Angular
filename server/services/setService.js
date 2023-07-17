const axios = require('axios');
const Set = require('../models/Set');

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

  // const legoSet = new Set();
  // legoSet.setId = set.data.set_num;
  // legoSet.name = set.data.name;
  // legoSet.year = set.data.year;
  // legoSet.parts = set.data.num_parts;
  // legoSet.image = set.data.set_img_url;
  // legoSet.minifigCount = set.data.count;
  // for (const fig of figs.data.results) {
  //   console.log(fig);
  //   legoSet.minifigs.push({
  //     name: fig.set_name,
  //     quantity: fig.quantity,
  //     image: fig.set_img_url,
  //   });
  // }

  // await Set.create(legoSet);

  return {
    setNum: set.data.set_num,
    name: set.data.name,
    year: set.data.year,
    parts: set.data.num_parts,
    image: set.data.set_img_url,
    minifigCount: figs.data.count,
    results: figs.data.results,
  };
};

exports.getLoggedInUserCollection = async (refreshToken) => {
  const user = await User.findOne({ refreshToken })
    .populate('sets')
    .select('sets');

  if (!user) {
    throw new Error('Invalid refresh token!');
  }

  return user.sets;
};
