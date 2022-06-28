describe("Multiple visits", function() {
    before(function () {    
        cy.clearCookies()
    });

    it("stores utm data for first utm visit", function() {
        cy.visit('http://localhost:8080/test/test-site/index.html?utm_source=test_source2&utm_campaign=test_campaign2&utm_medium=test_medium2');
        cy.getCookie('ils.utm_source').should('have.property', 'value', 'test_source2');
    });

    it("does not store NEW utm data for return NON UTM visits within visit timeframe", function() {
        cy.visit('http://localhost:8080/test/test-site/index.html?utm_source=test_source2&utm_campaign=test_campaign2&utm_medium=test_medium2');
        cy.getCookie('ils.utm_source').should('have.property', 'value', 'test_source2');

        cy.visit('http://localhost:8080/test/test-site/index.html?ils_referrer=some.com');
        cy.getCookie('ils.utm_source').should('have.property', 'value', 'test_source2');
    });
    
    it("stores new NON UTM data after 'visit' expiration", function() {
        cy.visit('http://localhost:8080/test/test-site/index.html?ils_referrer=google.com');
        cy.getCookie('ils.utm_source').should('have.property', 'value', 'google.com');

        cy.clearCookie('ils.visit');
        cy.visit('http://localhost:8080/test/test-site/index.html?ils_referrer=test.com');
        cy.getCookie('ils.utm_source').should('have.property', 'value', 'test.com');
    });
    
    it("utms overwrite existing utm data with new utm data always" , function() {
        cy.visit('http://localhost:8080/test/test-site/index.html?ils_referrer=google.com');
        cy.getCookie('ils.utm_source').should('have.property', 'value', 'google.com');

        cy.visit('http://localhost:8080/test/test-site/index.html?utm_source=overwrite_test&utm_campaign=overwrite_test');
        cy.getCookie('ils.utm_source').should('have.property', 'value', 'overwrite_test');
        cy.getCookie('ils.utm_campaign').should('have.property', 'value', 'overwrite_test');
    });
    
    
    it("direct traffic does not overwrite existing utm_source", function() {
        cy.visit('http://localhost:8080/test/test-site/index.html?utm_source=overwrite_test&utm_campaign=overwrite_test');
        cy.getCookie('ils.utm_source').should('have.property', 'value', 'overwrite_test');
        cy.getCookie('ils.utm_campaign').should('have.property', 'value', 'overwrite_test');

        cy.clearCookie('ils.visit');
        cy.visit('http://localhost:8080/test/test-site/index.html');
        cy.getCookie('ils.utm_source').should('have.property', 'value', 'overwrite_test');
    });

});
