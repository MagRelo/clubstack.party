const mongoose = require('mongoose');
const faker = require('faker');
faker.seed(27);

const UserModel = require('../models').UserModel;
const ContentModel = require('../models').ContentModel;

// get users and make them a query
async function createQueries() {
  try {
    // remove queries
    await ContentModel.deleteMany({});

    // get users
    const users = await UserModel.find({}).lean();

    // create query objects
    const queryObjects = users.map((user, index) => {
      const userItems = [1, 2, 3, 4, 5].map((index) => {
        const title =
          faker.company.catchPhraseAdjective() +
          ' ' +
          faker.company.catchPhraseNoun();

        return {
          user: user._id,
          type: 'Video',
          title: title,
          length: '15 min',
          description: faker.lorem.paragraph(),
          image:
            'https://picsum.photos/533/300?blur=1&random=' +
            faker.random.number(),
          alt: faker.lorem.paragraph(),
          category: faker.company.catchPhraseNoun(),
        };
      });

      return userItems.flat();
    });

    // Insert
    await ContentModel.create(queryObjects.flat(), (err, docs) => {
      if (err) {
        console.error(err);
      } else {
        console.info(
          'DB seeded. %d content items were successfully stored.',
          docs.length
        );
      }
    });

    // end
  } catch (error) {
    console.log(error);
  }
}
createQueries();
