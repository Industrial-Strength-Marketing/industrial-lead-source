describe("Visit WITH UTM", function() {
    
    it("stores utm data for utm visits ", function() {
        cy.visit('http://localhost:8080/test/test-site/index.html?utm_source=test_source2&utm_campaign=test_campaign2&utm_medium=test_medium2&utm_content=test_content2&utm_term=test_term2');
        
        cy.getCookie('ils.utm_source')
        .should('have.property', 'value', 'test_source2');

        cy.getCookie('ils.utm_campaign')
        .should('have.property', 'value', 'test_campaign2');
        
        cy.getCookie('ils.utm_medium')
        .should('have.property', 'value', 'test_medium2');

        cy.getCookie('ils.utm_content')
            .should('have.property', 'value', 'test_content2');

        cy.getCookie('ils.utm_term')
            .should('have.property', 'value', 'test_term2');

        
    });

    it("maintian utm data for utm visits when navigating pages", function() {
        cy.visit('http://localhost:8080/test/test-site/index.html?utm_source=test_source2&utm_campaign=test_campaign2&utm_medium=test_medium2&utm_content=test_content2&utm_term=test_term2');
        cy.get('#test-page-link').click();

        cy.getCookie('ils.utm_source')
        .should('have.property', 'value', 'test_source2');

        cy.getCookie('ils.utm_campaign')
        .should('have.property', 'value', 'test_campaign2')
        
        cy.getCookie('ils.utm_medium')
        .should('have.property', 'value', 'test_medium2')

        cy.getCookie('ils.utm_content')
            .should('have.property', 'value', 'test_content2');

        cy.getCookie('ils.utm_term')
            .should('have.property', 'value', 'test_term2');
        
        
        cy.get('#home-page-link').click();

        cy.getCookie('ils.utm_source')
        .should('have.property', 'value', 'test_source2');

        cy.getCookie('ils.utm_campaign')
        .should('have.property', 'value', 'test_campaign2')
        
        cy.getCookie('ils.utm_medium')
        .should('have.property', 'value', 'test_medium2')

        cy.getCookie('ils.utm_content')
            .should('have.property', 'value', 'test_content2');

        cy.getCookie('ils.utm_term')
            .should('have.property', 'value', 'test_term2');
        
    });
});
