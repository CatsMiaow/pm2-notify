
module.exports = (text, parameter) => {
  let template = text;

  Object.keys(parameter).forEach((key) => {
    template = template.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), parameter[key]);
  });

  return template;
};
