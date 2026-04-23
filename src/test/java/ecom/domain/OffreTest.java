package ecom.domain;

import static ecom.domain.CriseTestSamples.*;
import static ecom.domain.OffreTestSamples.*;
import static ecom.domain.UtilisateurTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import ecom.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OffreTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Offre.class);
        Offre offre1 = getOffreSample1();
        Offre offre2 = new Offre();
        assertThat(offre1).isNotEqualTo(offre2);

        offre2.setId(offre1.getId());
        assertThat(offre1).isEqualTo(offre2);

        offre2 = getOffreSample2();
        assertThat(offre1).isNotEqualTo(offre2);
    }

    @Test
    void utilisateurTest() {
        Offre offre = getOffreRandomSampleGenerator();
        Utilisateur utilisateurBack = getUtilisateurRandomSampleGenerator();

        offre.setUtilisateur(utilisateurBack);
        assertThat(offre.getUtilisateur()).isEqualTo(utilisateurBack);

        offre.utilisateur(null);
        assertThat(offre.getUtilisateur()).isNull();
    }

    @Test
    void criseTest() {
        Offre offre = getOffreRandomSampleGenerator();
        Crise criseBack = getCriseRandomSampleGenerator();

        offre.setCrise(criseBack);
        assertThat(offre.getCrise()).isEqualTo(criseBack);

        offre.crise(null);
        assertThat(offre.getCrise()).isNull();
    }
}
