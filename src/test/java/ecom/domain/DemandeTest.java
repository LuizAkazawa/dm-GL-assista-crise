package ecom.domain;

import static ecom.domain.CriseTestSamples.*;
import static ecom.domain.DemandeTestSamples.*;
import static ecom.domain.UtilisateurTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import ecom.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DemandeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Demande.class);
        Demande demande1 = getDemandeSample1();
        Demande demande2 = new Demande();
        assertThat(demande1).isNotEqualTo(demande2);

        demande2.setId(demande1.getId());
        assertThat(demande1).isEqualTo(demande2);

        demande2 = getDemandeSample2();
        assertThat(demande1).isNotEqualTo(demande2);
    }

    @Test
    void utilisateurTest() {
        Demande demande = getDemandeRandomSampleGenerator();
        Utilisateur utilisateurBack = getUtilisateurRandomSampleGenerator();

        demande.setUtilisateur(utilisateurBack);
        assertThat(demande.getUtilisateur()).isEqualTo(utilisateurBack);

        demande.utilisateur(null);
        assertThat(demande.getUtilisateur()).isNull();
    }

    @Test
    void criseTest() {
        Demande demande = getDemandeRandomSampleGenerator();
        Crise criseBack = getCriseRandomSampleGenerator();

        demande.setCrise(criseBack);
        assertThat(demande.getCrise()).isEqualTo(criseBack);

        demande.crise(null);
        assertThat(demande.getCrise()).isNull();
    }
}
