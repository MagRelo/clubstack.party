const xml2js = require('xml2js');
const fetch = require('node-fetch');

exports.getSubstackContent = async function(subdomain) {
  try {
    const fullUrl = 'https://' + subdomain + '.substack.com/feed';
    const response = await fetch(fullUrl);
    if (response.status !== 200) {
      throw new Error('failed to fetch from substack');
    }

    const text = await response.text();
    const json = await convertToJSON(text);
    const site = json.rss.channel[0];

    if (site) {
      // reformat
      return {
        title: site.title,
        description: site.description,
        copyright: site.copyright,
        headerImage: site.image[0],
        items: site.item.map((item) => {
          return {
            title: item.title,
            description: item.description,
            link: item.link[0],
            length: extractLength(item) + ' min',
            category: extractCategory(item),
            image: extractImage(item),
          };
        }),
      };
    }

    return {};
  } catch (error) {
    return {};
  }
};

async function convertToJSON(xml) {
  // console.dir(xml);
  return xml2js
    .parseStringPromise(xml)
    .then(function(result) {
      // console.log('Done');
      return result;
    })
    .catch((error) => {
      console.log('xml error');
      return null;
    });
}

function extractCategory(item) {
  if (item.enclosure && item.enclosure[0]) {
    const type = item.enclosure[0].$.type;

    switch (type) {
      case 'image/jpeg':
        return 'Blog Post';
      case 'audio/mpeg':
        return 'Podcast';
      case 'video/mpeg':
        return 'video';
      default:
        break;
    }
  }

  return 'General';
}

function extractLength(item) {
  if (item.enclosure && item.enclosure[0]) {
    const type = item.enclosure[0].$.type;
    const magicLengthNumber = 2100;

    switch (type) {
      case 'image/jpeg':
        return Math.floor(
          item['content:encoded'][0].length / magicLengthNumber
        );
      case 'audio/mpeg':
        return 15;
      case 'video/mpeg':
        return 15;
      default:
        break;
    }
  }
  return 15;
}

function extractImage(item) {
  if (item.enclosure && item.enclosure[0]) {
    const type = item.enclosure[0].$.type;

    switch (type) {
      case 'image/jpeg':
        return item.enclosure[0].$.url;
      case 'audio/mpeg':
        return 'https://via.placeholder.com/500x200?text=►';
      case 'video/mpeg':
        return 'https://via.placeholder.com/500x200?text=Video';
      default:
        break;
    }
  }
}
