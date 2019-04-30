onload = async () => {
  // Insert Footer Template
  const footerTemplate = await fetch('/templates/footer.hbs');
  const footerTemplateText = await footerTemplate.text();
  const compiledFooterTemplate = Handlebars.compile(footerTemplateText);
  document.getElementById("footer").innerHTML = compiledFooterTemplate({});
};