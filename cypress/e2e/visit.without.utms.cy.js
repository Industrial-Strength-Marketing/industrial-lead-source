describe("Visit WITHOUT UTM", function() {
    it("sets cookies to correct value for direct visits ", function() {
        cy.visit('http://localhost:8080/test/test-site/index.html?ils_referrer=none', {});
        
        cy.getCookie('ils.utm_source').should('have.property', 'value', 'Direct');
    });

    it("stores utm_medium, utm_source for an SEO referral ", function() {
        cy.visit('http://localhost:8080/test/test-site/index.html?ils_referrer=google.com');
        cy.getCookie('ils.utm_medium').should('have.property', 'value', 'organic');
        cy.getCookie('ils.utm_source').should('have.property', 'value', 'google.com');
    });

    it("maintains utm_medium, utm_source for an SEO referral when navigating to other pages ", function() {
        cy.visit('http://localhost:8080/test/test-site/index.html?ils_referrer=google.com');
        cy.getCookie('ils.utm_medium').should('have.property', 'value', 'organic');
        cy.getCookie('ils.utm_source').should('have.property', 'value', 'google.com');
        cy.get('#test-page-link').click();
        cy.getCookie('ils.utm_medium').should('have.property', 'value', 'organic');
        cy.getCookie('ils.utm_source').should('have.property', 'value', 'google.com');
    });

    it("stores utms_medium, utm_source for referral ", function() {
        cy.visit('http://localhost:8080/test/test-site/index.html?ils_referrer=some.com');
        cy.getCookie('ils.utm_medium').should('have.property', 'value', 'referral');
        cy.getCookie('ils.utm_source').should('have.property', 'value', 'some.com');
    });
    
    it("maintains utm_medium, utm_source for referral when navigating to other pages", function() {
        cy.visit('http://localhost:8080/test/test-site/index.html?ils_referrer=some.com');
         
        cy.getCookie('ils.utm_medium')
        .should('have.property', 'value', 'referral');
        
        cy.getCookie('ils.utm_source')
        .should('have.property', 'value', 'some.com');

        cy.get('#test-page-link').click();

        cy.getCookie('ils.utm_medium')
        .should('have.property', 'value', 'referral');
        
        cy.getCookie('ils.utm_source')
        .should('have.property', 'value', 'some.com');
    });
});
