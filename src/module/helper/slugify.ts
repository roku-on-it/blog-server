const trMap = {
  ç: 'c',
  ğ: 'g',
  ş: 's',
  ü: 'u',
  ı: 'i',
  ö: 'o',
};

export const slugify = async (text) => {
  if ('string' === typeof text) {
    for (const key in trMap) {
      text = await text.replace(new RegExp(key, 'ig'), trMap[key]);
    }

    return text
      .toLowerCase()
      .replace(/[^-a-zA-Z0-9\s]+/gi, '')
      .replace(/\s/gi, '-')
      .replace(/[-]+/gi, '-');
  }

  throw new TypeError('Unexpected value type of ' + typeof text);
};
