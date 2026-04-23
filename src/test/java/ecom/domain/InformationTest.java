package ecom.domain;

import static ecom.domain.CriseTestSamples.*;
import static ecom.domain.InformationTestSamples.*;
import static ecom.domain.UtilisateurTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import ecom.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InformationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Information.class);
        Information information1 = getInformationSample1();
        Information information2 = new Information();
        assertThat(information1).isNotEqualTo(information2);

        information2.setId(information1.getId());
        assertThat(information1).isEqualTo(information2);

        information2 = getInformationSample2();
        assertThat(information1).isNotEqualTo(information2);
    }

    @Test
    void utilisateurTest() {
        Information information = getInformationRandomSampleGenerator();
        Utilisateur utilisateurBack = getUtilisateurRandomSampleGenerator();

        information.setUtilisateur(utilisateurBack);
        assertThat(information.getUtilisateur()).isEqualTo(utilisateurBack);

        information.utilisateur(null);
        assertThat(information.getUtilisateur()).isNull();
    }

    @Test
    void criseTest() {
        Information information = getInformationRandomSampleGenerator();
        Crise criseBack = getCriseRandomSampleGenerator();

        information.setCrise(criseBack);
        assertThat(information.getCrise()).isEqualTo(criseBack);

        information.crise(null);
        assertThat(information.getCrise()).isNull();
    }
}
