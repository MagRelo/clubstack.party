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

const contentData = [
  {
    sectionTitle: 'Introduction',
    sectionDescription: "In this section we'll introduce concepts for things.",
    sectionData: [
      {
        title: 'Phonetic Awareness',
        category: 'Introduction',
        length: '15 min',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
        image: 'https://picsum.photos/533/300?blur=1&random=33',
        alt: 'video1',
      },
      {
        title: 'Decoding',
        category: 'Introduction',
        length: '15 min',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
        image: 'https://picsum.photos/533/300?blur=1&random=32',
        alt: 'video1',
      },
      {
        title: 'No Guessing',
        category: 'Letter Sounds',
        length: '15 min',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
        image: 'https://picsum.photos/533/300?blur=1&random=31',
        alt: 'video1',
      },
    ],
  },
  {
    sectionTitle: 'M, A, S, D',
    sectionDescription:
      'The first letters should be easy to see and easy to say.',
    sectionData: [
      {
        title: 'First Letters',
        category: 'M, A, S, D',
        length: '15 min',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
        image: 'https://picsum.photos/533/300?blur=1&random=33',
        alt: 'video1',
      },
      {
        title: 'Blending Sounds',
        category: 'M, A, S, D',
        length: '15 min',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
        image: 'https://picsum.photos/533/300?blur=1&random=32',
        alt: 'video1',
      },
      {
        title: 'Vowel-First Blending',
        category: 'M, A, S, D',
        length: '15 min',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
        image: 'https://picsum.photos/533/300?blur=1&random=31',
        alt: 'video1',
      },
    ],
  },
  {
    sectionTitle: 'P, B, F, R, T',
    sectionDescription:
      "In this section we'll add more letters, and do sound blending with compound words.",
    sectionData: [
      {
        title: 'Video 1',
        category: 'P, B, F, R, T',
        length: '15 min',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
        image: 'https://picsum.photos/533/300?blur=1&random=1',
        alt: 'video1',
      },
      {
        title: 'Video 2',
        category: 'P, B, F, R, T',
        length: '15 min',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
        image: 'https://picsum.photos/533/300?blur=1&random=2',
        alt: 'video1',
      },
      {
        title: 'Video 3',
        category: 'P, B, F, R, T',
        length: '15 min',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, reprehenderit velit odio ea consequuntur autem obcaecati aspernatur enim reiciendis voluptate.',
        image: 'https://picsum.photos/533/300?blur=1&random=3',
        alt: 'video1',
      },
    ],
  },
];
