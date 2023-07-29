const axios = require('axios');
const Set = require('../models/Set');
const User = require('../models/User');

const host = 'https://rebrickable.com';

exports.getLoggedInUserCollection = async (refreshToken) => {
  const user = await User.findOne({ refreshToken })
    .populate('sets')
    .select('sets');

  if (!user) {
    throw new Error('Invalid refresh token!');
  }

  return user.sets;
};

exports.addSet = async (setId, refreshToken) => {
  const foundSet = await axios.get(`${host}/api/v3/lego/sets/${setId}-1/`, {
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

  const setData = {
    setNum: foundSet.data.set_num,
    name: foundSet.data.name,
    year: foundSet.data.year,
    parts: foundSet.data.num_parts,
    image: foundSet.data.set_img_url,
    minifigCount: figs.data.count,
    minifigs: [],
  };

  for (const fig of figs.data.results) {
    setData.minifigs.push({
      name: fig.set_name,
      quantity: fig.quantity,
      image: fig.set_img_url,
    });
  }

  const user = await User.findOne({ refreshToken }).populate('sets');
  if (user.sets.find((set) => setData.setNum.includes(set.setNum))) {
    throw new Error('Set already exists in collection!');
  }

  const set = await Set.create(setData);
  user.sets.push(set._id);
  await user.save();
};
