async function navigation() {
    // Insert Navigation Template
    const navigationTemplate = await fetch('/templates/navigation.hbs');
    const navigationTemplateText = await navigationTemplate.text();
    const compiledNavigationTemplate = Handlebars.compile(navigationTemplateText);
    document.getElementById("navbar").innerHTML = compiledNavigationTemplate({});

    const mobileNavigationTemplate = await fetch('/templates/mobileNavigation.hbs');
    const mobileNavigationTemplateText = await mobileNavigationTemplate.text();
    const compiledMobileNavigationTemplate = Handlebars.compile(mobileNavigationTemplateText);
    document.getElementById("fixedMenu").innerHTML = compiledMobileNavigationTemplate({});
};