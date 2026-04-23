package ecom.domain;

import static ecom.domain.CriseTestSamples.*;
import static ecom.domain.UtilisateurTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import ecom.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class UtilisateurTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Utilisateur.class);
        Utilisateur utilisateur1 = getUtilisateurSample1();
        Utilisateur utilisateur2 = new Utilisateur();
        assertThat(utilisateur1).isNotEqualTo(utilisateur2);

        utilisateur2.setId(utilisateur1.getId());
        assertThat(utilisateur1).isEqualTo(utilisateur2);

        utilisateur2 = getUtilisateurSample2();
        assertThat(utilisateur1).isNotEqualTo(utilisateur2);
    }

    @Test
    void criseToucheeTest() {
        Utilisateur utilisateur = getUtilisateurRandomSampleGenerator();
        Crise criseBack = getCriseRandomSampleGenerator();

        utilisateur.addCriseTouchee(criseBack);
        assertThat(utilisateur.getCriseTouchees()).containsOnly(criseBack);

        utilisateur.removeCriseTouchee(criseBack);
        assertThat(utilisateur.getCriseTouchees()).doesNotContain(criseBack);

        utilisateur.criseTouchees(new HashSet<>(Set.of(criseBack)));
        assertThat(utilisateur.getCriseTouchees()).containsOnly(criseBack);

        utilisateur.setCriseTouchees(new HashSet<>());
        assertThat(utilisateur.getCriseTouchees()).doesNotContain(criseBack);
    }
}
